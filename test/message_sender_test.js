import { describe, it } from 'mocha';
import { assert, should } from 'chai';
import sinon from 'sinon';
import { connect } from '../src/message_sender';

should();

describe('message sender', () => {
  it('sends empty backlog when client connects', () => {
    const client = { emit: () => { } };
    const emit = sinon.stub(client, 'emit');

    connect(client);

    assert(emit.calledWith('backlog', { events: [] }));
  });
});
