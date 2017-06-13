import findSessionBlock from '../page1/find_session_block';

function parse(drivers, input) {
  if (input.x === undefined) {
    return null;
  }

  const driversPitData = input.x[findSessionBlock.from(input.x)].DR;

  if (driversPitData.length !== drivers.length) {
    throw new Error(`Expected ${drivers.length} drivers in x block but found ${driversPitData.length}`);
  }
  return null;
}

module.exports = { parse };
