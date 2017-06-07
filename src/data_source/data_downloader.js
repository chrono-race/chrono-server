import fetcher from './network/fetcher';
import jsonExtractor from './network/json_extractor';
import dataPoller from './polling_timer';
import lapMessageGenerator from './aggregate_event_generator';

function initialise(baseUrl, archiver, eventPublisher) {
  return new Promise((fulfill, reject) => {
    fetcher.fetch(baseUrl, 'all.js', archiver)
      .then((d) => {
        const data = jsonExtractor.process(d);
        const session = lapMessageGenerator.startSession(data, eventPublisher);
        dataPoller.start(baseUrl, archiver, Math.round(data.init.T / 1000000), session);
        fulfill();
      })
      .catch(reject);
  });
}

module.exports = { initialise };
