import driverParser from './page1/driver_parser';
import gapsParser from './page1/gaps_parser';
import page1Parser from './page1/parser';
import eventGeneratorFactory from './page1/event_generator';

function startSession(allJson, eventPublisher) {
  const drivers = driverParser.extractDrivers(allJson);
  const page1EventGenerator = eventGeneratorFactory.initialise();
  return {
    update: (curJson) => {
      const gaps = gapsParser.parse(drivers, curJson);
      const page1 = page1Parser.parse(drivers, curJson);

      const events = page1EventGenerator.generateFrom(gaps, page1);
      eventPublisher(events);
    },
  };
}

module.exports = { startSession };
