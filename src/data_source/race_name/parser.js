
function parse(input) {
  return {
    name: input.f && input.f.free && input.f.free.R ? input.f.free.R:'UNKNOWN',
  };
}

module.exports = { parse };
