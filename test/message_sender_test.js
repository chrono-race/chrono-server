import { describe, it } from 'mocha';
import { assert, should } from 'chai';
import sinon from 'sinon';
import { connect, send } from '../src/message_sender';

should();

describe('message sender', () => {
  it('sends empty backlog when client connects', () => {
    const client = { emit: () => { } };
    const emit = sinon.stub(client, 'emit');

    connect(client);

    assert(emit.calledWith('backlog', { events: [] }));
  });

  it('sends a message to already connected clients', () => {
    const client = { emit: () => { } };
    const emit = sinon.stub(client, 'emit');
    const message = { message: 'hello' };

    connect(client);
    send(message);

    assert(emit.calledWith('backlog', { events: [] }));
    assert(emit.calledWith('events', { events: [message] }));
  });
});
