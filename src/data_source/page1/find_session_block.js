
function from(input) {
  const keys = Object.keys(input).filter(x => x !== 'TY' && x !== 'T');
  if (keys.length > 1) {
    throw new Error(`Could not find session, multiple fields: ${keys.join(', ')}`);
  }
  if (keys.length === 0) {
    throw new Error('Could not find session, no fields found in block');
  }
  return keys[0];
}

module.exports = { from };
