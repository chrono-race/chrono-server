const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

let listeners = [];

function tick() {
  console.log('tick!');
  listeners.forEach((socket) => {
    socket.emit('announcements', { message: 'tick!' });
  });
}

function onDisconnect(socket) {
  listeners = listeners.filter(l => l !== socket);
  console.log(`A user has left, now ${listeners.length}`);
}

function onConnect(socket) {
  listeners.push(socket);
  console.log(`A new user has joined, now ${listeners.length}`);
  socket.on('disconnect', () => onDisconnect(socket));
  socket.emit('announcements', { message: 'A new user has joined!' });
}

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

io.on('connection', onConnect);

console.log('Starting server on port 8000');
setInterval(tick, 1000);
server.listen(8000);
