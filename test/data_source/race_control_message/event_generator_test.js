import { describe, it } from 'mocha';
import { assert, should } from 'chai';
import eventGeneratorFactory from '../../../src/data_source/race_control_message/event_generator';

should();

describe('race control message event generator', () => {
  it('generate no events when no race control message', () => {
    const message = { };
    const events = eventGeneratorFactory.initialise()(message);

    assert(events.length.should.equal(0));
  });

  it('generate an event on first race control message', () => {
    const message = {
      message: 'first message',
    };
    const events = eventGeneratorFactory.initialise()(message);

    assert(events.length.should.equal(1));
    assert(events[0].type.should.equal('race_control_message'));
    assert(events[0].message.should.equal('first message'));
  });
});
