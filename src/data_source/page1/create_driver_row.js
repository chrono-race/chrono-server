
function isInSector1(driverPage1) {
  return !Number.isNaN(driverPage1.s3Time);
}

function getLapNumber(driver, lastGaps, lastPage1) {
  const lapsCompleted = Math.floor(lastGaps[driver].lapsCompleted);
  if (isInSector1(lastPage1[driver])) {
    return lapsCompleted;
  }
  return lapsCompleted + 1;
}

function getLapTime(driver, lapNumber) {
  if (lapNumber === 1 || !isInSector1(driver)) {
    return NaN;
  }
  return driver.lapTime;
}

function createDriverRow(driver, lastGaps, lastPage1) {
  const lapNumber = getLapNumber(driver, lastGaps, lastPage1);
  const r = Object.assign(
    {
      driver,
      lapNumber,
    },
    lastPage1[driver],
    {
      lapTime: getLapTime(lastPage1[driver], lapNumber),
    });
  return r;
}

module.exports = { createDriverRow };
