import fs from 'fs';

function listPastSessions() {
  return fs.readdirSync('../sessions/')
          .filter(f => f.endsWith('.cache'))
          .map(f => f.substring(0, f.length - '.cache'.length));
}

export default listPastSessions;

