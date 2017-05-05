import winston from 'winston';
import pollingLoop from './polling_loop';

function start(baseUrl, archiver, startTime) {
  const p = pollingLoop.create(baseUrl, archiver, startTime);
  winston.info('poller started');
  setInterval(p.poll, 1000);
}

module.exports = { start };
