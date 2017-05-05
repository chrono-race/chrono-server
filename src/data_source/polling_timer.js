import winston from 'winston';
import poller from './poller';

function start(baseUrl, archiver, startTime) {
  const p = poller.create(baseUrl, archiver, startTime);
  winston.info('poller started');
  setInterval(p.poll, 1000);
}

module.exports = { start };
