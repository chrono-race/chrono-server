import fs from 'fs';
import winston from 'winston';
import jsonExtractor from '../network/json_extractor';
import lapMessageGenerator from '../aggregate_event_generator';

function fetchFile(file, sessionName, session) {
  const curJs = fs.readFileSync(`../sessions/${sessionName}/${file}`);
  const cur = jsonExtractor.process(curJs);
  session.update(cur);
}

function fetch(sessionName) {
  const allJs = fs.readFileSync(`../sessions/${sessionName}/all.js`);
  const allData = jsonExtractor.process(allJs);
  const events = [];
  const eventPublisher = (e) => {
    e.forEach(msg => events.push(msg));
  };
  const session = lapMessageGenerator.startSession(allData, eventPublisher);

  const files = fs.readdirSync(`../sessions/${sessionName}/`);
  const curFiles = files.filter(f => f.startsWith('cur.js_'));

  curFiles.forEach((file, index) => {
    if (index % 250 === 0) {
      winston.info(`Processing ${file}: ${index} / ${curFiles.length} (${(index * 100 / curFiles.length).toFixed(0)}%)`);
    }
    fetchFile(file, sessionName, session);
  });

  return events;
}

export default fetch;
