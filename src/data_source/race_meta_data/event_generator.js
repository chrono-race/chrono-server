
function initialise() {
  let lastRaceName = null;
  let lastTotalLaps = NaN;

  return (raceMetaData) => {
    let dataChanged = false;
    if (raceMetaData.name && (!lastRaceName || lastRaceName !== raceMetaData.name)) {
      lastRaceName = raceMetaData.name;
      dataChanged = true;
    }

    if (raceMetaData.totalLaps && (isNaN(lastTotalLaps) || lastTotalLaps !== raceMetaData.totalLaps)) {
      lastTotalLaps = raceMetaData.totalLaps;
      dataChanged = true;
    }

    if (dataChanged) {
      return [
        {
          type: 'race_meta_data',
          name: lastRaceName,
          totalLaps: lastTotalLaps,
        },
      ];
    }
    return [];
  };
}

module.exports = { initialise };
