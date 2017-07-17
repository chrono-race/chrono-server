
function parse(input) {
  if (input.sq === undefined || input.sq.T === undefined) {
    return {};
  }
  return {
    time: Math.round(input.sq.T / 1000000),
  };
}

module.exports = { parse };
