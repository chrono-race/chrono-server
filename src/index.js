import winston from 'winston';
import { send, connect } from './message_sender';
import dataDownloader from './data_source/data_downloader';
import archiver from './data_source/archiver';

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const baseUrl = 'http://localhost:3000/';

let count = 0;

function tick() {
  count += 1;
  console.log(`tick ${count}`);
  send({ message: `tick ${count}` });
}

winston.add(winston.transports.File, { filename: 'logs/timing.log' });
winston.info('timing process started');

const a = archiver();
dataDownloader.initialise(baseUrl, a)
  .then(() => {
    winston.info('timing process initialised');
  });

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

io.on('connection', connect);

console.log('Starting server on port 8000');
setInterval(tick, 5000);
server.listen(8000);
