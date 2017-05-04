import fetcher from './network/fetcher';
import jsonExtractor from './network/json_extractor';
import dataPoller from './poller';
import lapMessageGenerator from './lap_message_generator';

function initialise(baseUrl, archiver, eventPublisher) {
  return new Promise((fulfill, reject) => {
    fetcher.fetch(baseUrl, 'all.js', archiver)
      .then((d) => {
        const data = jsonExtractor.process(d);
        const session = lapMessageGenerator.startSession(data, eventPublisher);
        dataPoller.start(baseUrl, archiver, Math.round(data.init.T / 1000000));
        fulfill();
      })
      .catch(reject);
  });
}

module.exports = { initialise };
