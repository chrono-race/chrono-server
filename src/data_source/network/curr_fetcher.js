import fetcher from './fetcher.js';

function fetch(baseUrl, time, archiver) {
  return fetcher.fetch(baseUrl, `cur.js?${time}`, archiver);
}

module.exports = { fetch };
