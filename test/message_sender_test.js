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

  it('sends multiple messages to already connected clients', () => {
    const client = { emit: () => { } };
    const emit = sinon.stub(client, 'emit');
    const message1 = { message: 'hello' };
    const message2 = { message: 'goodbye' };

    connect(client);
    send([message1, message2]);

    assert(emit.calledWith('backlog', { events: [] }));
    assert(emit.calledWith('events', { events: [message1, message2] }));
  });
});
