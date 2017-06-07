
function parse(input) {
  return {
    time: Math.round(input.sq.T / 1000000),
  };
}

module.exports = { parse };
