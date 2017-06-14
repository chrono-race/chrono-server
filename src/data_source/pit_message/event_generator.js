
function createDriverPitMessage(driver, driverPitData, lastPitData) {
  if (driverPitData === null ||
      JSON.stringify(driverPitData) === JSON.stringify(lastPitData)) {
    return null;
  }
  return Object.assign({
    type: 'pit',
    driver,
  }, driverPitData);
}

function initialise() {
  const lastPitData = { };
  return (pitData) => {
    if (pitData === null) {
      return [];
    }
    const events = Object.keys(pitData)
      .map(driver => createDriverPitMessage(driver, pitData[driver], lastPitData[driver]))
      .filter(e => e !== null);
    Object.keys(pitData)
      .filter(driver => pitData[driver] !== null)
      .forEach((driver) => { lastPitData[driver] = pitData[driver]; });
    return events;
  };
}

module.exports = { initialise };
