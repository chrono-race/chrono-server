import { describe, it, before, after } from 'mocha';
import { assert, should } from 'chai';
import sinon from 'sinon';
import currFetcher from '../../../src/data_source/network/curr_fetcher';
import fetcher from '../../../src/data_source/network/fetcher';

should();

describe('curr fetcher', () => {
  describe('fetch', () => {
    let fetch;

    before(() => {
      fetch = sinon.stub(fetcher, 'fetch');
    });

    after(() => {
      fetch.restore();
    });

    it('should fetch next cur.js', () => {
      const baseUrl = 'http://localhost:8080/';
      const time = 12345;
      const archiver = { };

      currFetcher.fetch(baseUrl, time, archiver);

      assert(fetch.calledOnce);
      assert(fetch.calledWith(baseUrl, 'cur.js?12345', archiver));
    });
  });
});
