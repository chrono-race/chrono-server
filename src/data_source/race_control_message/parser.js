import findSessionBlock from '../page1/find_session_block';

function parse(input) {
  const sessionName = findSessionBlock.from(input.c);
  const message = input.c[sessionName].M;
  return {
    message,
  };
}

module.exports = { parse };
