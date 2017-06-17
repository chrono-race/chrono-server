import { describe, it } from 'mocha';
import { assert, should } from 'chai';
import eventGeneratorFactory from '../../../src/data_source/race_name/event_generator';

should();

describe('racename event generator', () => {
  it('generate an event when racename is available', () => {
    const eventGenerator = eventGeneratorFactory.initialise();

    const events = eventGenerator({ name: 'My Race' });

    assert(events.length.should.equal(1));
    assert(events[0].name.should.equal('My Race'));
    assert(events[0].type.should.equal('racename'));
  });

  it('does not generate an event when racename does not change', () => {
    const eventGenerator = eventGeneratorFactory.initialise();

    eventGenerator({ name: 'My Race' });
    const events = eventGenerator({ name: 'My Race' });

    assert(events.length.should.equal(0));
  });
});
