import { describe, it } from 'mocha';
import { assert, should } from 'chai';
import eventGeneratorFactory from '../../../src/data_source/race_name/event_generator';

should();

describe('race_name event generator', () => {
  it('generate an event when race name is available', () => {
    const eventGenerator = eventGeneratorFactory.initialise();

    const events = eventGenerator({ name: 'My Race' });

    assert(events.length.should.equal(1));
    assert(events[0].name.should.equal('My Race'));
    assert(events[0].type.should.equal('race_name'));
  });

  it('does not generate an event when race name does not change', () => {
    const eventGenerator = eventGeneratorFactory.initialise();

    eventGenerator({ name: 'My Race' });
    const events = eventGenerator({ name: 'My Race' });

    assert(events.length.should.equal(0));
  });
});
