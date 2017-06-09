import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert, should } from 'chai';
import sinon from 'sinon';
import driverParser from '../../src/data_source/page1/driver_parser';
import eventGenerator from '../../src/data_source/page1/event_generator';
import gapsParser from '../../src/data_source/page1/gaps_parser';
import page1Parser from '../../src/data_source/page1/parser';
import { startSession } from '../../src/data_source/aggregate_event_generator';
import timeOfDayParser from '../../src/data_source/time_of_day/parser';
import timeOfDayEventGeneratorFactory from '../../src/data_source/time_of_day/event_generator';
import raceControlMessageParser from '../../src/data_source/race_control_message/parser';
import raceControlMessageEventGeneratorFactory from '../../src/data_source/race_control_message/event_generator';

should();

describe('lap message generator', () => {
  let extractDrivers;
  let initialise;

  beforeEach(() => {
    extractDrivers = sinon.stub(driverParser, 'extractDrivers');
    initialise = sinon.stub(eventGenerator, 'initialise');
  });

  afterEach(() => {
    extractDrivers.restore();
    initialise.restore();
  });

  it('extracts drivers and initialises event generator', () => {
    const allJson = { all: 'json' };
    const drivers = [{ driver: 'VAN' }];
    const generator = sinon.stub();

    extractDrivers.withArgs(allJson).returns(drivers);
    initialise.returns(generator);

    startSession(allJson);

    assert(extractDrivers.calledOnce);
    assert(initialise.calledOnce);
  });

  describe('on update', () => {
    let parseGaps;
    let parsePage1;
    let parseTimeOfDay;
    let parseRaceControlMessage;
    let timeOfDayFactory;
    let raceControlMessageFactory;

    beforeEach(() => {
      parseGaps = sinon.stub(gapsParser, 'parse');
      parsePage1 = sinon.stub(page1Parser, 'parse');
      parseTimeOfDay = sinon.stub(timeOfDayParser, 'parse');
      parseRaceControlMessage = sinon.stub(raceControlMessageParser, 'parse');
      timeOfDayFactory = sinon.stub(timeOfDayEventGeneratorFactory, 'initialise');
      raceControlMessageFactory = sinon.stub(raceControlMessageEventGeneratorFactory, 'initialise');
    });

    afterEach(() => {
      parseGaps.restore();
      parsePage1.restore();
      parseTimeOfDay.restore();
      parseRaceControlMessage.restore();
      timeOfDayFactory.restore();
      raceControlMessageFactory.restore();
    });

    it('parses, generates events then publishes', () => {
      const allJson = { all: 'json' };
      const drivers = [{ driver: 'VAN' }];
      const page1EventGenerator = sinon.stub();
      const timeOfDayEventGenerator = sinon.stub();
      const raceControlMessageGenerator = sinon.stub();
      const curJson = { current: 'json' };
      const gaps = { gaps: [] };
      const page1 = { page: 'one' };
      const events = [{ event: 1 }];
      const timeOfDay = { time: 1234 };
      const timeOfDayEvents = [{ event: 2 }];
      const raceControlMessage = { message: 'test' };
      const raceControlMessageEvents = [{ event: 3 }];

      const publisher = sinon.stub();

      extractDrivers.withArgs(allJson).returns(drivers);
      initialise.returns(page1EventGenerator);
      timeOfDayFactory.returns(timeOfDayEventGenerator);
      raceControlMessageFactory.returns(raceControlMessageGenerator);

      parseGaps.withArgs(drivers, curJson).returns(gaps);
      parsePage1.withArgs(drivers, curJson).returns(page1);
      parseTimeOfDay.withArgs(curJson).returns(timeOfDay);
      parseRaceControlMessage.withArgs(curJson).returns(raceControlMessage);

      page1EventGenerator.withArgs(gaps, page1).returns(events);
      timeOfDayEventGenerator.withArgs(timeOfDay).returns(timeOfDayEvents);
      raceControlMessageGenerator.withArgs(raceControlMessage).returns(raceControlMessageEvents);

      const session = startSession(allJson, publisher);
      session.update(curJson);

      assert(publisher.calledWith([{ event: 1 }, { event: 2 }, { event: 3 }]));
    });
  });
});
