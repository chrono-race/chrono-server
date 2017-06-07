
function initialise() {
  return {
    generateFrom: timeOfDay => [
       { time: timeOfDay.time },
    ],
  };
}

module.exports = { initialise };
