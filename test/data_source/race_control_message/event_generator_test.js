import { describe, it } from 'mocha';
import { assert, should } from 'chai';
import eventGeneratorFactory from '../../../src/data_source/race_control_message/event_generator';

should();

describe('race control message event generator', () => {
  it('generates no events when no race control message', () => {
    const message = { };
    const eventGenerator = eventGeneratorFactory.initialise();
    const events = eventGenerator(message);

    assert(events.length.should.equal(0));
  });

  it('generates an event on first race control message', () => {
    const message = {
      message: 'first message',
      timestamp: 1234,
    };
    const eventGenerator = eventGeneratorFactory.initialise();
    const events = eventGenerator(message);

    assert(events.length.should.equal(1));
    assert(events[0].type.should.equal('race_control_message'));
    assert(events[0].message.should.equal('first message'));
    assert(events[0].timestamp.should.equal(1234));
  });

  it('does not generate an event when race control message does not change', () => {
    const message = {
      message: 'first message',
    };
    const eventGenerator = eventGeneratorFactory.initialise();
    eventGenerator(message);
    const events = eventGenerator(message);

    assert(events.length.should.equal(0));
  });
});
