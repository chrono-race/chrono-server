import { describe, it, beforeEach } from 'mocha';
import { assert, should } from 'chai';
import sinon from 'sinon';
import { connect, send, disconnect, reset } from '../src/message_sender';

should();

describe('message sender', () => {
  beforeEach(() => {
    reset();
  });

  it('sends empty backlog when client connects', () => {
    const client = {
      emit: () => { },
      on: () => { },
    };
    const emit = sinon.stub(client, 'emit');

    connect(client);

    assert(emit.calledWith('backlog', { events: [] }));
  });

  it('sends multiple messages to already connected clients', () => {
    const client = {
      emit: () => { },
      on: () => { },
    };
    const emit = sinon.stub(client, 'emit');
    const message1 = { message: 'hello 2' };
    const message2 = { message: 'goodbye 2' };

    connect(client);
    send([message1, message2]);

    assert(emit.calledWith('backlog', { events: [] }));
    assert(emit.calledWith('events', { events: [message1, message2] }));
  });

  it('does not send messages to disconnected clients', () => {
    const client = {
      emit: () => { },
      on: () => { },
    };
    const emit = sinon.stub(client, 'emit');
    const message1 = { message: 'hello' };
    const message2 = { message: 'goodbye' };

    connect(client);
    disconnect(client);
    send([message1, message2]);

    assert(emit.calledWith('backlog', { events: [] }));
    assert(emit.neverCalledWith('events', { events: [message1, message2] }));
  });

  it('sends existing backlog when client connects', () => {
    const client = {
      emit: () => { },
      on: () => { },
    };
    const emit = sinon.stub(client, 'emit');
    const message1 = { message: 'hello' };
    const message2 = { message: 'goodbye' };

    send([message1, message2]);

    connect(client);

    assert(emit.calledWith('backlog', { events: [message1, message2] }));
  });

  it('on connect registers disconnect handler', () => {
    const client = {
      emit: () => { },
      on: () => { },
    };
    const on = sinon.stub(client, 'on');

    connect(client);

    assert(on.calledOnce);
    assert(on.getCall(0).args[0].should.equal('disconnect'));

    const disconnectHandler = on.getCall(0).args[1];
  });
});
