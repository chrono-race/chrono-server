import listDirectoryContents from 'list-directory-contents';

function ls(path, callback) {
  listDirectoryContents(path, callback);
}

module.exports = { ls };
