import fetcher from './network/fetcher';
import dataProcessor from './network/json_extractor';
import dataPoller from './poller';

function initialise(baseUrl, archiver) {
  return new Promise((fulfill, reject) => {
    fetcher.fetch(baseUrl, 'all.js', archiver)
      .then((d) => {
        const data = dataProcessor.process(d);
        dataPoller.start(baseUrl, archiver, Math.round(data.init.T / 1000000));
        fulfill();
      })
      .catch(reject);
  });
}

module.exports = { initialise };
