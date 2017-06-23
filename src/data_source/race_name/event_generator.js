
function initialise() {
  let lastRaceName = null;
  return (raceName) => {
    if (lastRaceName === null || lastRaceName !== raceName.name) {
      lastRaceName = raceName.name;
      return [
        {
          type: 'race_name',
          name: raceName.name,
        },
      ];
    }
    return [];
  };
}

module.exports = { initialise };
