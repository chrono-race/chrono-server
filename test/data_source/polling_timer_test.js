import { describe, it, before, after } from 'mocha';
import { assert, should } from 'chai';
import sinon from 'sinon';
import winston from 'winston';
import dataPoller from '../../src/data_source/polling_timer';
import poller from '../../src/data_source/poller';

should();

describe('data poller', () => {
  describe('start', () => {
    let clock;
    let info;
    let createPoller;

    before(() => {
      clock = sinon.useFakeTimers();
      info = sinon.stub(winston, 'info');
      createPoller = sinon.stub(poller, 'create');
    });

    after(() => {
      clock.restore();
      info.restore();
      createPoller.restore();
    });

    it('should create a new poller', () => {
      const baseUrl = 'http://localhost:8080/';
      const archiver = { };
      const startTime = 123456;
      const p = { poll: () => { } };

      createPoller.returns(p);

      dataPoller.start(baseUrl, archiver, startTime);

      assert(createPoller.calledOnce);
      assert(createPoller.calledWith(baseUrl, archiver, startTime));
    });

    it('should poll once a second', () => {
      const baseUrl = 'http://localhost:8080/';
      const archiver = { };
      const startTime = 123456;
      const p = { poll: () => { } };
      const poll = sinon.stub(p, 'poll');

      createPoller.returns(p);

      dataPoller.start(baseUrl, archiver, startTime);

      clock.tick(1000);

      assert(poll.calledOnce);

      clock.tick(1000);

      assert(poll.calledTwice);
    });
  });
});
