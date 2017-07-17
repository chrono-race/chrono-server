import winston from 'winston';
import { send, connect } from './message_sender';
import dataDownloader from './data_source/data_downloader';
import archiver from './data_source/archiver';
import serverConfig from './server_config';


const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const baseUrl = serverConfig.baseUrl;

function onEvents(events) {
  if (events.length > 0) {
    send(events);
  }
}

const connectTime = serverConfig.connectAt === undefined
  ? undefined
  : Date.parse(serverConfig.connectAt);

function checkIfTimeToConnect(timeToConnect, fulfill) {
  const timeRemaining = Math.floor((timeToConnect - new Date()) / 1000);
  if (timeRemaining > 0) {
    onEvents([{ type: 'waiting', remainingSec: timeRemaining }]);
    setTimeout(() => checkIfTimeToConnect(timeToConnect, fulfill), 1000);
  } else {
    fulfill();
  }
}

function waitToConnect() {
  return new Promise((fulfill) => {
    checkIfTimeToConnect(connectTime, fulfill);
  });
}

winston.add(winston.transports.File, { filename: 'logs/timing.log' });
winston.info('timing process started');

const a = archiver();
waitToConnect()
  .then(() => dataDownloader.initialise(baseUrl, a, onEvents))
  .then(() => {
    winston.info('timing process initialised');
  });

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

io.on('connection', connect);

console.log('Starting server on port 8000');
server.listen(8000);
