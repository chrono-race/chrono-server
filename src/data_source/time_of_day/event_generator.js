
function initialise() {
  let lastTime = null;
  return (timeOfDay) => {
    if (timeOfDay.time === undefined) {
      return [];
    }
    if (lastTime === null || lastTime !== timeOfDay.time) {
      lastTime = timeOfDay.time;
      return [
        {
          type: 'time',
          time: timeOfDay.time,
        },
      ];
    }
    return [];
  };
}

module.exports = { initialise };
