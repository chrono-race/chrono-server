import findSessionBlock from '../page1/find_session_block';

function parse(input) {
  if (input.c === undefined) {
    return {
    };
  }
  const sessionName = findSessionBlock.from(input.c);
  const message = input.c[sessionName].M;
  const timestamp = Math.floor(input.c.T / 1000000);
  return {
    message,
    timestamp,
  };
}

module.exports = { parse };
