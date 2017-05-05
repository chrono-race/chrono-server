import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert, should } from 'chai';
import sinon from 'sinon';
import currFetcher from '../../src/data_source/network/curr_fetcher';
import poller from '../../src/data_source/poller';

should();

describe('poller', () => {
  let fetchCurrent;

  beforeEach(() => {
    fetchCurrent = sinon.stub(currFetcher, 'fetch');
  });

  afterEach(() => {
    fetchCurrent.restore();
  });

  it('fetches current', () => {
    const baseUrl = 'http://localhost:8080';
    const startTime = 1000;
    const archiver = { };

    const p = poller.create(baseUrl, archiver, startTime);

    p.poll();

    assert(fetchCurrent.calledOnce);
    assert(fetchCurrent.calledWith(baseUrl, startTime + 1, archiver));
  });

  it('increments time each call', () => {
    const baseUrl = 'http://localhost:8080';
    const startTime = 1000;
    const archiver = { };

    const p = poller.create(baseUrl, archiver, startTime);

    p.poll();

    assert(fetchCurrent.calledOnce);
    assert(fetchCurrent.calledWith(baseUrl, startTime + 1, archiver));

    p.poll();

    assert(fetchCurrent.calledTwice);
    assert(fetchCurrent.calledWith(baseUrl, startTime + 2, archiver));
  });
});
