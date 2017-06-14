
function createDriverPitMessage(driver, driverPitData, lastPitData) {
  if (JSON.stringify(driverPitData) === JSON.stringify(lastPitData)) {
    return null;
  }
  return Object.assign({
    type: 'pit',
    driver,
  }, driverPitData);
}

function initialise() {
  let lastPitData = { };
  return (pitData) => {
    if (pitData === null) {
      return [];
    }
    const events = Object.keys(pitData)
      .map(driver => createDriverPitMessage(driver, pitData[driver], lastPitData[driver]))
      .filter(e => e !== null);
    lastPitData = pitData;
    return events;
  };
}

module.exports = { initialise };
