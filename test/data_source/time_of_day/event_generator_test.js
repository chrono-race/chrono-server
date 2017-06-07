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
  });
});
