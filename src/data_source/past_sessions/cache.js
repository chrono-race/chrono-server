import fs from 'fs';
import winston from 'winston';
import fetch from './fetch';

function cacheSession(sessionName) {
  winston.info(`Fetching ${sessionName}`);
  const events = fetch(sessionName);
  winston.info('Done, writing file');
  fs.writeFileSync(`../sessions/${sessionName}.cache`, JSON.stringify(events));
}

cacheSession(process.argv[2]);
