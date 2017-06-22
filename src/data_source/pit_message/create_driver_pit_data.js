function toPitPairs(fields) {
  const pairs = [];
  for (let i = 0; i < Math.floor(fields.length / 2); i++) { // eslint-disable-line no-plusplus
    pairs.push({
      time: parseInt(fields[i * 2], 10) / 10000,
      lap: parseInt(fields[(i * 2) + 1], 10),
    });
  }
  return pairs;
}

function toPitTriplets(fields) {
  const triplets = [];
  for (let i = 0; i < Math.floor(fields.length / 3); i++) { // eslint-disable-line no-plusplus
    triplets.push({
      tyreType: parseInt(fields[i * 3], 10),
      ageInStint: parseInt(fields[(i * 3) + 1], 10),
      ageOverall: parseInt(fields[(i * 3) + 2], 10),
    });
  }
  return triplets;
}

function createDriverPitData(driverPitData, tyreData, tyreInfo) {
  const pitPairs = toPitPairs(driverPitData.split(','));
  const pd = {
    currentStatus: '',
  };
  const pitTriplets = toPitTriplets(tyreInfo.split(','));

  if (pitPairs.length > 0 && pitPairs[pitPairs.length - 1].lap === 0) {
    pd.currentStatus = 'in pit';
    pitPairs.splice(pitPairs.length - 1, 1);
  }

  pitPairs.splice(0, 0, {
    lap: -1,
    time: NaN,
  });

  pd.stints = pitPairs.map((p, i) => ({
    startLap: p.lap + 1,  // start lap is pit lap + 1
    tyre: tyreData[tyreData.length - 1 - i] || '',
    pitLaneTime: p.time,
    tyreAge: i < pitTriplets.length ? pitTriplets[i].ageOverall - pitTriplets[i].ageInStint : NaN,
  }));

  return pd;
}

export default createDriverPitData;
