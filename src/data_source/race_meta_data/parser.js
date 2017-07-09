
function parse(input) {
  let raceName = 'UNKNOWN';
  let totalLaps = NaN;

  if (input.f && input.f.free) {
    raceName = input.f.free.R ? input.f.free.R : raceName;
    totalLaps = input.f.free.TL ? parseInt(input.f.free.TL, 10) : totalLaps;
  }

  return {
    name: raceName,
    totalLaps,
  };
}

module.exports = { parse };
