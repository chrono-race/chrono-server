
function createDriverPitMessage(driver, driverPitData) {
  return Object.assign({
    type: 'pit',
    driver,
  }, driverPitData);
}

function initialise() {
  return (pitData) => {
    if (pitData === null) {
      return [];
    }
    return Object.keys(pitData).map(driver => createDriverPitMessage(driver, pitData[driver]));
  };
}

module.exports = { initialise };
