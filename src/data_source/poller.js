import currFetcher from './network/curr_fetcher';
import jsonExtractor from './network/json_extractor';

function create(baseUrl, archiver, startTime, session) {
  let time = startTime;
  return {
    poll: () => {
      time += 1;
      return currFetcher.fetch(baseUrl, time, archiver)
        .then((d) => {
          const cur = jsonExtractor.process(d);
          session.update(cur);
        });
    },
  };
}

module.exports = { create };
