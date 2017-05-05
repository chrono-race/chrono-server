import currFetcher from './network/curr_fetcher';

function create(baseUrl, archiver, startTime) {
  let time = startTime;
  return {
    poll: () => {
      time += 1;
      currFetcher.fetch(baseUrl, time, archiver);
    },
  };
}

module.exports = { create };
