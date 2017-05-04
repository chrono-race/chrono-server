import fetcher from './network/fetcher';
import jsonExtractor from './network/json_extractor';
import dataPoller from './poller';

function initialise(baseUrl, archiver) {
  return new Promise((fulfill, reject) => {
    fetcher.fetch(baseUrl, 'all.js', archiver)
      .then((d) => {
        const data = jsonExtractor.process(d);
        dataPoller.start(baseUrl, archiver, Math.round(data.init.T / 1000000));
        fulfill();
      })
      .catch(reject);
  });
}

module.exports = { initialise };
