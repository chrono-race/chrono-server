function createDriverPitData(driverPitData, tyreData) {
  if (driverPitData === '') {
    return null;
  }
  const pd = {
    currentStatus: '',
    stints: [
      {
        startLap: 1,
        tyre: tyreData,
      },
    ],
  };
  if (driverPitData === '0,0') {
    pd.currentStatus = 'in pit';
  }
  return pd;
}

export default createDriverPitData;
