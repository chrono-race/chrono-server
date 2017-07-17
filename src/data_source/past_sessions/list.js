import fs from 'fs';

function listPastSessions() {
  return fs.readdirSync('../sessions/')
          .filter(f => f.startsWith('2017-'));
}

export default listPastSessions;

