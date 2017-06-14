import { describe, it } from 'mocha';
import { assert, should } from 'chai';
import sinon from 'sinon';
import eventGeneratorFactory from '../../../src/data_source/pit_message/event_generator';

should();

describe('page 1 event generator', () => {
  it('outputs empty list when given nothing', () => {
    const eventGenerator = eventGeneratorFactory.initialise();

    const events = eventGenerator(null);

    assert(events.length.should.equal(0));
  });

  it('outputs message for a driver on receipt of pit data', () => {
    const eventGenerator = eventGeneratorFactory.initialise();

    const pitData = {
      VET: {
        currentStatus: '',
        stints: [
          {
            startLap: 1,
            tyre: 'S',
          },
        ],
      },
    };

    const events = eventGenerator(pitData);

    assert(events.length.should.equal(1));
    assert(events[0].type.should.equal('pit'));
    assert(events[0].driver.should.equal('VET'));
    assert(events[0].currentStatus.should.equal(''));
    assert(events[0].stints.length.should.equal(1));
    assert(events[0].stints[0].startLap.should.equal(1));
    assert(events[0].stints[0].tyre.should.equal('S'));
  });

  it('does not output message when pit data for a driver is repeated', () => {
    const eventGenerator = eventGeneratorFactory.initialise();

    const pitData = {
      VET: {
        currentStatus: '',
        stints: [
          {
            startLap: 1,
            tyre: 'S',
          },
        ],
      },
    };

    eventGenerator(pitData);
    const events = eventGenerator(pitData);

    assert(events.length.should.equal(0));
  });

  it('does not output message when pit data is null', () => {
    const eventGenerator = eventGeneratorFactory.initialise();

    const partialPitData = {
      VET: null,
    };

    const events = eventGenerator(partialPitData);

    assert(events.length.should.equal(0));
  });

  it('does not output message when pit data for a driver is repeated with null in between', () => {
    const eventGenerator = eventGeneratorFactory.initialise();

    const pitData = {
      VET: {
        currentStatus: '',
        stints: [
          {
            startLap: 1,
            tyre: 'S',
          },
        ],
      },
    };
    const partialPitData = {
      VET: null,
    };

    eventGenerator(pitData);
    eventGenerator(partialPitData);
    const events = eventGenerator(pitData);

    assert(events.length.should.equal(0));
  });
});
