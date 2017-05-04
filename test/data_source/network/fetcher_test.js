import sinon from 'sinon';
import request from 'request';
import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert, should } from 'chai';
import winston from 'winston';
import fetcher from '../../../src/data_source/network/fetcher';

should();

describe('fetcher', () => {
  const baseUrl = 'http://localhost:8080/';
  const filename = 'file.js';
  let get;
  let info;
  let error;
  const archiver = { logFile: () => { } };

  beforeEach(() => {
    get = sinon.stub(request, 'get');
    sinon.spy(archiver, 'logFile');
    info = sinon.stub(winston, 'info');
    error = sinon.stub(winston, 'error');
  });

  afterEach(() => {
    get.restore();
    info.restore();
    error.restore();
    archiver.logFile.restore();
  });

  it('fetches url and archives', (done) => {
    const response = JSON.stringify({ aThing: 'a value' });
    get.withArgs({ url: `${baseUrl}${filename}`, headers: { 'User-Agent': fetcher.UserAgent } }).yields(null, { statusCode: 200 }, response);

    fetcher.fetch(baseUrl, filename, archiver)
      .then((contents) => {
        if (contents !== response) {
          throw new Error(`Unexpected contents, got: ${contents}`);
        }
        assert(archiver.logFile.calledWith(filename, response));
        assert(info.calledWith('successfully fetched http://localhost:8080/file.js'));
        done();
      })
      .catch(done);
  });

  it('archives and rejects in case of non-200 response', (done) => {
    get.withArgs({ url: `${baseUrl}${filename}`, headers: { 'User-Agent': fetcher.UserAgent } }).yields(null, { statusCode: 404 }, 'Not found');

    fetcher.fetch(baseUrl, filename, archiver)
      .then(() => { throw new Error('expected request to fail'); })
      .catch((e) => {
        if (e.message !== 'Unexpected status code: 404') {
          done(new Error(`Got unexpected error: ${e.message}`));
        } else {
          assert(archiver.logFile.calledWith(filename, 'Not found'));
          assert(error.calledWith('error fetching http://localhost:8080/file.js - status code 404'));
          done();
        }
      })
      .catch(done);
  });

  it('archives and rejects in case of error fetching', (done) => {
    get.withArgs({ url: `${baseUrl}${filename}`, headers: { 'User-Agent': fetcher.UserAgent } }).yields(new Error('simulated error'), null, 'Network error');

    fetcher.fetch(baseUrl, filename, archiver)
      .then(() => { throw new Error('expected request to fail'); })
      .catch((e) => {
        if (e.message !== 'simulated error') {
          done(new Error(`Got unexpected error: ${e.message}`));
        } else {
          assert(archiver.logFile.calledWith(filename, 'Network error'));
          assert(error.calledWith('error fetching http://localhost:8080/file.js: simulated error'));
          done();
        }
      })
      .catch(done);
  });
});
