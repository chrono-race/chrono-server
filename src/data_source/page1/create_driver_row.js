
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

function createDriverRow(driver, lastGaps, lastPage1) {
  return Object.assign(
    {
      driver,
      lapNumber: getLapNumber(driver, lastGaps, lastPage1),
    },
    lastPage1[driver]);
}

module.exports = { createDriverRow };
