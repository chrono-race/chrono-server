import { send, connect } from './message_sender';

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

let count = 0;

function tick() {
  count += 1;
  console.log(`tick ${count}`);
  send({ message: `tick ${count}` });
}

function onConnect(socket) {
  connect(socket);
}

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

io.on('connection', onConnect);

console.log('Starting server on port 8000');
setInterval(tick, 5000);
server.listen(8000);
