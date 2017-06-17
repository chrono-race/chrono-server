
function initialise() {
  let lastRacename = null;
  return (racename) => {
    if (lastRacename === null || lastRacename !== racename.name) {
      lastRacename = racename.name;
      return [
        {
          type: 'racename',
          name: racename.name,
        },
      ];
    }
    return [];
  };
}

module.exports = { initialise };
