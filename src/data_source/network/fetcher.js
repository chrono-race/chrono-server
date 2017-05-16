import request from 'request';
import winston from 'winston';

const UserAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36';

function fetch(baseUrl, filename, archiver) {
  return new Promise((fulfill, reject) => {
    try {
      const options = {
        url: `${baseUrl}${filename}`,
        headers: {
          'User-Agent': UserAgent,
        },
      };
      request.get(options, (error, response, body) => {
        archiver.logFile(filename, body);
        if (error != null) {
          winston.error(`error fetching ${options.url}: ${error.message}`);
          reject(error);
        } else if (response.statusCode === 200) {
          winston.info(`successfully fetched ${options.url}`);
          fulfill(body);
        } else {
          winston.error(`error fetching ${options.url} - status code ${response.statusCode}`);
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = { fetch, UserAgent };
