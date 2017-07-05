import fs from 'fs';

const serverConfig = JSON.parse(fs.readFileSync('server.json'));

export default serverConfig;
