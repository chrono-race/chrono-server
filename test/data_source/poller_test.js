import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert, should } from 'chai';
import sinon from 'sinon';
import currFetcher from '../../src/data_source/network/curr_fetcher';
import jsonExtractor from '../../src/data_source/network/json_extractor';
import poller from '../../src/data_source/poller';

should();

describe('poller', () => {
  let fetchCurrent;
  let process;

  beforeEach(() => {
    fetchCurrent = sinon.stub(currFetcher, 'fetch');
    process = sinon.stub(jsonExtractor, 'process');
  });

  afterEach(() => {
    fetchCurrent.restore();
    process.restore();
  });

  it('fetches current, extracts json & generates lap messages', (done) => {
    const baseUrl = 'http://localhost:8080';
    const startTime = 1000;
    const archiver = { };
    const currentResponse = 'current response';
    const session = { update: () => { } };
    const updateSession = sinon.stub(session, 'update');
    const currentJson = { current: 'json' };

    fetchCurrent.returns(Promise.resolve(currentResponse));
    process.returns(currentJson);

    const p = poller.create(baseUrl, archiver, startTime, session);

    p.poll()
      .then(() => {
        assert(fetchCurrent.calledOnce);
        assert(fetchCurrent.calledWith(baseUrl, startTime + 1, archiver));

        assert(process.calledOnce);

        assert(updateSession.calledOnce);
        assert(updateSession.calledWith(currentJson));

        done();
      })
      .catch(done);
  });

  it('increments time each call', () => {
    const baseUrl = 'http://localhost:8080';
    const startTime = 1000;
    const archiver = { };
    const currentResponse = 'current response';

    fetchCurrent.returns(Promise.resolve(currentResponse));

    const p = poller.create(baseUrl, archiver, startTime);

    p.poll();

    assert(fetchCurrent.calledOnce);
    assert(fetchCurrent.calledWith(baseUrl, startTime + 1, archiver));

    p.poll();

    assert(fetchCurrent.calledTwice);
    assert(fetchCurrent.calledWith(baseUrl, startTime + 2, archiver));
  });
});
