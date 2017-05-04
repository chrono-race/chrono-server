const keysToCheck = ['lapTime', 'position', 's1Time', 's2Time', 's3Time', 'gap', 'interval'];

function areDifferent(v1, v2) {
  if (Number.isNaN(v1) && Number.isNaN(v2)) {
    return false;
  }
  return v1 !== v2;
}

function isChanged(before, after) {
  return keysToCheck.filter(key => areDifferent(before[key], after[key])).length > 0;
}

module.exports = { isChanged };
