import date from 'date-and-time';
import fs from 'fs';
import winston from 'winston';
import wrapper from './filesystem/fs_utils';

export default () => {
  const now = new Date();
  const sessionName = date.format(now, 'YYYY-MM-DD_HHmm');
  const path = `sessions/${sessionName}`;
  wrapper.mkdirs(path);
  return {
    path,
    logFile: (fileName, fileContents) => {
      const name = fileName.replace('?', '_');
      try {
        fs.writeFileSync(`${path}/${name}`, fileContents);
      } catch (e) {
        winston.error(`Error writing file ${path}/${name}: ${e}`);
      }
    },
  };
};
