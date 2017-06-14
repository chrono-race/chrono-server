import driverParser from './page1/driver_parser';
import gapsParser from './page1/gaps_parser';
import page1Parser from './page1/parser';
import eventGeneratorFactory from './page1/event_generator';
import timeOfDayParser from './time_of_day/parser';
import timeOfDayEventGeneratorFactory from './time_of_day/event_generator';
import raceControlMessageParser from './race_control_message/parser';
import raceControlMessageEventGeneratorFactory from './race_control_message/event_generator';
import pitMessageParser from './pit_message/parser';
import pitMessageEventGeneratorFactory from './pit_message/event_generator';

function startSession(allJson, eventPublisher) {
  const drivers = driverParser.extractDrivers(allJson);
  const page1EventGenerator = eventGeneratorFactory.initialise();
  const timeOfDayEventGenerator = timeOfDayEventGeneratorFactory.initialise();
  const raceControlMessageEventGenerator = raceControlMessageEventGeneratorFactory.initialise();
  const pitMessageEventGenerator = pitMessageEventGeneratorFactory.initialise();
  return {
    update: (curJson) => {
      const gaps = gapsParser.parse(drivers, curJson);
      const page1 = page1Parser.parse(drivers, curJson);
      const timeOfDay = timeOfDayParser.parse(curJson);
      const raceControlMessage = raceControlMessageParser.parse(curJson);
      const pitMessage = pitMessageParser.parse(drivers, curJson);

      const events = page1EventGenerator(gaps, page1);
      const timeOfDayEvents = timeOfDayEventGenerator(timeOfDay);
      const raceControlMessageEvents = raceControlMessageEventGenerator(raceControlMessage);
      const pitMessageEvents = pitMessageEventGenerator(pitMessage);
      eventPublisher(events.concat(timeOfDayEvents).concat(raceControlMessageEvents).concat(pitMessageEvents));
    },
  };
}

module.exports = { startSession };
