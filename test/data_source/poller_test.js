import { describe, it, before, after } from 'mocha';
import { assert, should } from 'chai';
import sinon from 'sinon';
import winston from 'winston';
import currFetcher from '../../src/data_source/network/curr_fetcher';
import dataPoller from '../../src/data_source/poller';

should();

describe('data poller', () => {
  describe('start', () => {
    let clock;
    let fetch;
    let info;

    before(() => {
      clock = sinon.useFakeTimers();
      fetch = sinon.stub(currFetcher, 'fetch');
      info = sinon.stub(winston, 'info');
    });

    after(() => {
      clock.restore();
      fetch.restore();
      info.restore();
    });

    it('should poll for cur.js once a second', () => {
      const baseUrl = 'http://localhost:8080/';
      const archiver = { };
      const startTime = 123456;

      dataPoller.start(baseUrl, archiver, startTime, currFetcher);

      clock.tick(1000);

      assert(fetch.calledOnce);
      assert(fetch.calledWith(baseUrl, 123457, archiver));

      clock.tick(1000);

      assert(fetch.calledTwice);
      assert(fetch.calledWith(baseUrl, 123458, archiver));
      assert(info.calledWith('poller started'));
    });
  });
});
