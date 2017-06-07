
function parse(input) {
  return {
    time: Math.round(input.init.T / 1000000),
  };
}

module.exports = { parse };
