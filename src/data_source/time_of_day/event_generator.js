
function initialise() {
  let lastTime = null;
  return {
    generateFrom: (timeOfDay) => {
      if (lastTime === null || lastTime !== timeOfDay.time) {
        lastTime = timeOfDay.time;
        return [
          { time: timeOfDay.time },
        ];
      }
      return [];
    },
  };
}

module.exports = { initialise };
