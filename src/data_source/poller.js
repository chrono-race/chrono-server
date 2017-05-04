import winston from 'winston';
import currFetcher from './network/curr_fetcher';

function poller(baseUrl, archiver, startTime) {
  let time = startTime;
  return {
    poll: () => {
      time += 1;
      currFetcher.fetch(baseUrl, time, archiver);
    },
  };
}

function start(baseUrl, archiver, startTime) {
  const p = poller(baseUrl, archiver, startTime);
  winston.info('poller started');
  setInterval(p.poll, 1000);
}

module.exports = { start };
