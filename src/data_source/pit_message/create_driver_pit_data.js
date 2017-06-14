function toPitPairs(fields) {
  const pairs = [];
  for (let i = 0; i < Math.floor(fields.length / 2); i++) {
    pairs.push({
      time: parseInt(fields[i * 2], 10) / 1000,
      lap: parseInt(fields[(i * 2) + 1], 10),
    });
  }
  return pairs;
}

function createDriverPitData(driverPitData, tyreData) {
  if (driverPitData === '') {
    return null;
  }
  const pitPairs = toPitPairs(driverPitData.split(','));
  const pd = {
    currentStatus: '',
  };

  if (pitPairs[pitPairs.length - 1].lap === 0) {
    pd.currentStatus = 'in pit';
    pitPairs.splice(pitPairs.length - 1, 1);
  }

  pitPairs.splice(0, 0, { lap: 0 });

  pd.stints = pitPairs.map((p, i) => ({
    startLap: p.lap + 1,  // start lap is pit lap + 1
    tyre: tyreData[tyreData.length - 1 - i],
  }));

  return pd;
}

export default createDriverPitData;
