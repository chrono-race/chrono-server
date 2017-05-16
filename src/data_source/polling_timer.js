import winston from 'winston';
import poller from './poller';

function start(baseUrl, archiver, startTime, session) {
  const p = poller.create(baseUrl, archiver, startTime, session);
  winston.info('poller started');
  return setInterval(() => p.poll().catch(e => winston.error(`Error polling ${e}`)), 1000);
}

module.exports = { start };
