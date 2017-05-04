import findSessionBlock from './find_session_block';

function tlasMatch(first, second) {
  if (first.length !== second.length) {
    return false;
  }
  const res = first.map((e1, i) => {
    const e2 = second[i];
    return e1 === e2;
  });

  return res.reduce((v1, v2) => v1 && v2, true);
}

function parse(drivers, input) {
  const pageOne = {};
  if (input.o === undefined) {
    return null;
  }
  const sessionName = findSessionBlock.from(input.o);
  const pageOneDrivers = input.o[sessionName].DR;

  if (drivers.length !== pageOneDrivers.length) {
    throw new Error(`Expected ${drivers.length} drivers in page one but found ${pageOneDrivers.length}`);
  }
  if (input.init !== undefined) {
    const initSessionName = findSessionBlock.from(input.init);
    const givenDriverTlas = drivers.map(d => d.tla);
    const page1DriverTlas = input.init[initSessionName].Drivers.map(d => d.Initials);
    if (!tlasMatch(givenDriverTlas, page1DriverTlas)) {
      throw new Error(`Driver order mismatch in page 1. Expected ${givenDriverTlas.join(', ')} but got ${page1DriverTlas.join(', ')}`);
    }
  }
  const timestamp = Math.round(input.o.T / 1000000);

  drivers.forEach((d, i) => {
    const driverPageOne = pageOneDrivers[i];
    const fields = driverPageOne.O.split(',');
    const lapTime = parseFloat(fields[1]);
    const position = parseInt(fields[4], 10);
    const s1Time = parseFloat(fields[5]);
    const s2Time = parseFloat(fields[6]);
    const s3Time = parseFloat(fields[7]);
    const gap = parseFloat(fields[9]);
    const speed1 = parseInt(fields[10], 10);
    const speed2 = parseInt(fields[11], 10);
    const speed3 = parseInt(fields[12], 10);
    const speedTrap = parseInt(fields[13], 10);
    const interval = parseFloat(fields[14]);

    pageOne[d.tla] = {
      lapTime,
      position,
      s1Time,
      s2Time,
      s3Time,
      gap,
      speed1,
      speed2,
      speed3,
      speedTrap,
      interval,
      timestamp,
    };
  });
  return pageOne;
}

module.exports = { parse };
