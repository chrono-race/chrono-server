import fs from 'fs';
import wrapper from './wrapper';

function mkdirs(path) {
  path.split('/').forEach((dir, index, splits) => {
    const dirPath = splits.slice(0, index + 1).join('/');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  });
}

function listFiles(path) {
  return new Promise((fulfill, reject) => {
    wrapper.ls(path, (err, tree) => {
      if (err !== null) {
        reject(err);
      } else {
        fulfill(tree.sort());
      }
    });
  });
}

module.exports = { mkdirs, listFiles };
