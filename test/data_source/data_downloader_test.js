import { describe, it, before, after } from 'mocha';
import { assert, should } from 'chai';
import sinon from 'sinon';
import fetcher from '../../src/data_source/network/fetcher';
import dataPoller from '../../src/data_source/polling_timer';
import jsonExtractor from '../../src/data_source/network/json_extractor';
import lapMessageGenerator from '../../src/data_source/aggregate_event_generator';
import { initialise } from '../../src/data_source/data_downloader';

should();

describe('data downloader', () => {
  describe('initialise', () => {
    let fetch;
    let process;
    let start;
    let startSession;

    before(() => {
      fetch = sinon.stub(fetcher, 'fetch');
      process = sinon.stub(jsonExtractor, 'process');
      start = sinon.stub(dataPoller, 'start');
      startSession = sinon.stub(lapMessageGenerator, 'startSession');
    });

    after(() => {
      fetch.restore();
      process.restore();
      start.restore();
      startSession.restore();
    });

    it('fetches all.js, processes, starts session, creates data poller', (done) => {
      const baseUrl = 'http://localhost:8080/';
      const archiver = { };
      const fileContents = 'file contents';
      const startTime = 123456;
      const processedData = {
        init: {
          T: 123456123456,
        },
      };
      const eventPublisher = sinon.stub();
      const session = { session: true };

      process.withArgs(fileContents).returns(processedData);

      fetch.withArgs(baseUrl, 'all.js', archiver).returns(Promise.resolve(fileContents));
      startSession.withArgs(processedData, eventPublisher).returns(session);

      initialise(baseUrl, archiver, eventPublisher)
        .then(() => {
          assert(fetch.calledWith(baseUrl, 'all.js', archiver));
          assert(process.calledWith(fileContents));
          assert(start.calledWith(baseUrl, archiver, startTime, session));
          assert(startSession.calledWith(processedData, eventPublisher));
          done();
        })
        .catch(done);
    });

    it('rejects in case of error fetching all.js', (done) => {
      const baseUrl = 'http://localhost:8080/';
      const archiver = { };

      fetch.withArgs(baseUrl, 'all.js', archiver).returns(Promise.reject(new Error('simulated error')));

      initialise(baseUrl, archiver)
        .then(() => { throw new Error('expected initialise to reject but it fulfilled'); })
        .catch((e) => {
          if (e.message === 'simulated error') {
            done();
          } else {
            done(e);
          }
        });
    });
  });
});
