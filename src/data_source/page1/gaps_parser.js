const findSessionBlock = require('./find_session_block');

function parse(drivers, input) {
  if (input.sq === undefined) {
    return null;
  }

  const gaps = {};

  const sessionName = findSessionBlock.from(input.sq);
  const gapDrivers = input.sq[sessionName].DR;

  if (gapDrivers.length !== drivers.length) {
    throw new Error(`Expected ${drivers.length} drivers in sq block but found ${gapDrivers.length}`);
  }

  drivers.forEach((d, i) => {
    const gapDriver = gapDrivers[i];
    const fields = gapDriver.G.split(',');

    const lapsCompleted = parseFloat(fields[0]);

    gaps[d.tla] = {
      lapsCompleted,
    };
  });

  return gaps;
}

module.exports = { parse };
