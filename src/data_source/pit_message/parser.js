import findSessionBlock from '../page1/find_session_block';

function createDriverPitData(driverPitData) {
  if (driverPitData === '') {
    return null;
  }
  const pd = {
    currentStatus: '',
    stints: [
      {
        startLap: 1,
        tyre: 'M',
      },
    ],
  };
  if (driverPitData === '0,0') {
    pd.currentStatus = 'in pit';
  }
  return pd;
}

function parse(drivers, input) {
  if (input.x === undefined) {
    return null;
  }

  const driversPitData = input.x[findSessionBlock.from(input.x)].DR;

  if (driversPitData.length !== drivers.length) {
    throw new Error(`Expected ${drivers.length} drivers in x block but found ${driversPitData.length}`);
  }

  const pitData = { };

  drivers.forEach((d, i) => {
    const driverPitData = driversPitData[i].PD;
    pitData[d.tla] = createDriverPitData(driverPitData);
  });

  return pitData;
}

module.exports = { parse };
