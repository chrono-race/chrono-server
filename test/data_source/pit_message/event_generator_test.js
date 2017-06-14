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
});
