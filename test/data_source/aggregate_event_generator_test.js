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
import raceMetaDataParser from '../../src/data_source/race_meta_data/parser';
import raceMetaDataEventGeneratorFactory from '../../src/data_source/race_meta_data/event_generator';
import raceControlMessageParser from '../../src/data_source/race_control_message/parser';
import raceControlMessageEventGeneratorFactory from '../../src/data_source/race_control_message/event_generator';
import pitMessageParser from '../../src/data_source/pit_message/parser';
import pitMessageEventGeneratorFactory from '../../src/data_source/pit_message/event_generator';

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

  it('extracts drivers, initialises event generator and sends drivers event', () => {
    const allJson = { all: 'json' };
    const drivers = [{ tla: 'VAN', color: '#ffffff' }];
    const generator = sinon.stub();
    const eventPublisher = sinon.stub();

    extractDrivers.withArgs(allJson).returns(drivers);
    initialise.returns(generator);

    startSession(allJson, eventPublisher);

    assert(extractDrivers.calledOnce);
    assert(initialise.calledOnce);
    assert(eventPublisher.calledWith([{
      type: 'drivers',
      drivers,
    }]));
  });

  describe('on update', () => {
    let parseGaps;
    let parsePage1;
    let parseTimeOfDay;
    let parseRaceControlMessage;
    let parsePitMessage;
    let parseRaceMetaData;
    let timeOfDayFactory;
    let raceControlMessageFactory;
    let pitMessageFactory;
    let raceMetaDataFactory;

    beforeEach(() => {
      parseGaps = sinon.stub(gapsParser, 'parse');
      parsePage1 = sinon.stub(page1Parser, 'parse');
      parseTimeOfDay = sinon.stub(timeOfDayParser, 'parse');
      parsePitMessage = sinon.stub(pitMessageParser, 'parse');
      parseRaceControlMessage = sinon.stub(raceControlMessageParser, 'parse');
      parseRaceMetaData = sinon.stub(raceMetaDataParser, 'parse');

      timeOfDayFactory = sinon.stub(timeOfDayEventGeneratorFactory, 'initialise');
      raceControlMessageFactory = sinon.stub(raceControlMessageEventGeneratorFactory, 'initialise');
      pitMessageFactory = sinon.stub(pitMessageEventGeneratorFactory, 'initialise');
      raceMetaDataFactory = sinon.stub(raceMetaDataEventGeneratorFactory, 'initialise');
    });

    afterEach(() => {
      parseGaps.restore();
      parsePage1.restore();
      parseTimeOfDay.restore();
      parseRaceControlMessage.restore();
      parsePitMessage.restore();
      parseRaceMetaData.restore();

      timeOfDayFactory.restore();
      raceControlMessageFactory.restore();
      pitMessageFactory.restore();
      raceMetaDataFactory.restore();
    });

    it('parses, generates events then publishes', () => {
      const allJson = { all: 'json' };
      const drivers = [{ driver: 'VAN' }];
      const page1EventGenerator = sinon.stub();
      const timeOfDayEventGenerator = sinon.stub();
      const raceControlMessageGenerator = sinon.stub();
      const pitMessageGenerator = sinon.stub();
      const raceNameEventGenerator = sinon.stub();
      const curJson = { current: 'json' };
      const gaps = { gaps: [] };
      const page1 = { page: 'one' };
      const events = [{ event: 1 }];
      const timeOfDay = { time: 1234 };
      const timeOfDayEvents = [{ event: 2 }];
      const raceControlMessage = { message: 'test' };
      const raceControlMessageEvents = [{ event: 3 }];
      const pitMessage = { pit: 'true' };
      const pitMessageEvents = [{ event: 4 }];
      const raceMetaData = { raceName: '1234' };
      const raceMetaDataEvents = [{ event: 5 }];

      const publisher = sinon.stub();

      extractDrivers.withArgs(allJson).returns(drivers);
      initialise.returns(page1EventGenerator);
      timeOfDayFactory.returns(timeOfDayEventGenerator);
      raceControlMessageFactory.returns(raceControlMessageGenerator);
      pitMessageFactory.returns(pitMessageGenerator);
      raceMetaDataFactory.returns(raceNameEventGenerator);

      parseGaps.withArgs(drivers, curJson).returns(gaps);
      parsePage1.withArgs(drivers, curJson).returns(page1);
      parseTimeOfDay.withArgs(curJson).returns(timeOfDay);
      parseRaceControlMessage.withArgs(curJson).returns(raceControlMessage);
      parsePitMessage.withArgs(drivers, curJson).returns(pitMessage);
      parseRaceMetaData.withArgs(allJson).returns(raceMetaData);

      page1EventGenerator.withArgs(gaps, page1).returns(events);
      timeOfDayEventGenerator.withArgs(timeOfDay).returns(timeOfDayEvents);
      raceControlMessageGenerator.withArgs(raceControlMessage).returns(raceControlMessageEvents);
      pitMessageGenerator.withArgs(pitMessage).returns(pitMessageEvents);
      raceNameEventGenerator.withArgs(raceMetaData).returns(raceMetaDataEvents);

      const session = startSession(allJson, publisher);
      session.update(curJson);

      assert(publisher.calledWith([{ event: 1 },
                                   { event: 2 },
                                   { event: 3 },
                                   { event: 4 },
                                   { event: 5 },
      ]));
    });
  });
});
