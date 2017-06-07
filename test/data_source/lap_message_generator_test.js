import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert, should } from 'chai';
import sinon from 'sinon';
import driverParser from '../../src/data_source/page1/driver_parser';
import eventGenerator from '../../src/data_source/page1/event_generator';
import gapsParser from '../../src/data_source/page1/gaps_parser';
import page1Parser from '../../src/data_source/page1/parser';
import { startSession } from '../../src/data_source/lap_message_generator';

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

    beforeEach(() => {
      parseGaps = sinon.stub(gapsParser, 'parse');
      parsePage1 = sinon.stub(page1Parser, 'parse');
    });

    afterEach(() => {
      parseGaps.restore();
      parsePage1.restore();
    });

    it('parses page 1 gaps & drivers, generates events then publishes', () => {
      const allJson = { all: 'json' };
      const drivers = [{ driver: 'VAN' }];
      const generator = { generateFrom: () => { } };
      const curJson = { current: 'json' };
      const gaps = { gaps: [] };
      const page1 = { page: 'one' };
      const events = [{ event: 1 }];

      const updateGenerator = sinon.stub(generator, 'generateFrom');
      const publisher = sinon.stub();

      extractDrivers.withArgs(allJson).returns(drivers);
      initialise.returns(generator);

      parseGaps.withArgs(drivers, curJson).returns(gaps);
      parsePage1.withArgs(drivers, curJson).returns(page1);

      updateGenerator.withArgs(gaps, page1).returns(events);

      const session = startSession(allJson, publisher);
      session.update(curJson);

      assert(publisher.calledWith(events));
    });
  });
});
