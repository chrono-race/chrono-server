import { describe, it } from 'mocha';
import { assert, should } from 'chai';
import eventGeneratorFactory from '../../../src/data_source/time_of_day/event_generator';

should();

describe('time of day event generator', () => {
  it('generate an event on first time of day', () => {
    const eventGenerator = eventGeneratorFactory.initialise();

    const events = eventGenerator.generateFrom({ time: 1000 });

    assert(events.length.should.equal(1));
    assert(events[0].time.should.equal(1000));
    assert(events[0].type.should.equal('time'));
  });

  it('generates an event when time of day changes', () => {
    const eventGenerator = eventGeneratorFactory.initialise();

    eventGenerator.generateFrom({ time: 1000 });
    const events = eventGenerator.generateFrom({ time: 1001 });

    assert(events.length.should.equal(1));
    assert(events[0].time.should.equal(1001));
    assert(events[0].type.should.equal('time'));
  });

  it('does not generate an event when time of day does not change', () => {
    const eventGenerator = eventGeneratorFactory.initialise();

    eventGenerator.generateFrom({ time: 1000 });
    const events = eventGenerator.generateFrom({ time: 1000 });

    assert(events.length.should.equal(0));
  });
});
