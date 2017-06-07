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
    const generator = { generateFrom: () => { } };

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
    let timeOfDayFactory;

    beforeEach(() => {
      parseGaps = sinon.stub(gapsParser, 'parse');
      parsePage1 = sinon.stub(page1Parser, 'parse');
      // console.log(`stubbing in ${timeOfDayEventGeneratorFactory.initialise}`);
      // console.log(`stubbing in ${timeOfDayParser.parse}`);
      parseTimeOfDay = sinon.stub(timeOfDayParser, 'parse');
      timeOfDayFactory = sinon.stub(timeOfDayEventGeneratorFactory, 'initialise');
    });

    afterEach(() => {
      parseGaps.restore();
      parsePage1.restore();
      parseTimeOfDay.restore();
      timeOfDayFactory.restore();
    });

    it('parses, generates events then publishes', () => {
      const allJson = { all: 'json' };
      const drivers = [{ driver: 'VAN' }];
      const page1EventGenerator = { generateFrom: () => { } };
      const timeOfDayEventGenerator = { generateFrom: () => { } };
      const curJson = { current: 'json' };
      const gaps = { gaps: [] };
      const page1 = { page: 'one' };
      const events = [{ event: 1 }];
      const timeOfDay = { time: 1234 };
      const timeOfDayEvents = [{ event: 2 }];

      const updateGenerator = sinon.stub(page1EventGenerator, 'generateFrom');
      const timeOfDayGenerator = sinon.stub(timeOfDayEventGenerator, 'generateFrom');
      const publisher = sinon.stub();

      extractDrivers.withArgs(allJson).returns(drivers);
      initialise.returns(page1EventGenerator);
      timeOfDayFactory.returns(timeOfDayEventGenerator);

      parseGaps.withArgs(drivers, curJson).returns(gaps);
      parsePage1.withArgs(drivers, curJson).returns(page1);
      parseTimeOfDay.withArgs(curJson).returns(timeOfDay);

      updateGenerator.withArgs(gaps, page1).returns(events);
      timeOfDayGenerator.withArgs(timeOfDay).returns(timeOfDayEvents);

      const session = startSession(allJson, publisher);
      session.update(curJson);

      assert(publisher.calledWith([{ event: 1 }, { event: 2 }]));
    });
  });
});
