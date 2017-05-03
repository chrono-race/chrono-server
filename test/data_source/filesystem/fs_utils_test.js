import sinon from 'sinon';
import fs from 'fs';
import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import { mkdirs, listFiles } from '../../../src/data_source/filesystem/fs_utils';
import wrapper from '../../../src/data_source/filesystem/wrapper';

describe('mkdirs', () => {
  let mkdirSync;
  let existsSync;

  beforeEach(() => {
    mkdirSync = sinon.stub(fs, 'mkdirSync');
    existsSync = sinon.stub(fs, 'existsSync');
  });

  afterEach(() => {
    mkdirSync.restore();
    existsSync.restore();
  });

  it('makes a directory', () => {
    mkdirs('wibble');

    assert(mkdirSync.calledWith('wibble'));
  });

  it('does not make a directory if it already exists', () => {
    existsSync.withArgs('wibble').returns(true);

    mkdirs('wibble');

    assert(mkdirSync.notCalled);
  });

  it('makes multiple directories', () => {
    mkdirs('one/two/three');

    assert(mkdirSync.calledWith('one'));
    assert(mkdirSync.calledWith('one/two'));
    assert(mkdirSync.calledWith('one/two/three'));
  });
});

describe('list files', () => {
  let ls;

  beforeEach(() => {
    ls = sinon.stub(wrapper, 'ls');
  });

  afterEach(() => {
    ls.restore();
  });

  it('returns list of files', (done) => {
    const path = 'some/path';
    const tree = ['first', 'second', 'third'];

    ls.withArgs(path).yields(null, tree);

    listFiles(path)
      .then((result) => {
        result.should.deep.equal(tree);
        done();
      })
      .catch(done);
  });

  it('rejects in case of error', (done) => {
    const path = 'some/path';

    ls.withArgs(path).yields(new Error('simulated error'), null);

    listFiles(path)
      .then(() => {
        done(new Error('Unexpected success'));
      })
      .catch((e) => {
        if (e.message === 'simulated error') {
          done();
        } else {
          done(e);
        }
      });
  });

  it('sorts unsorted list of files', (done) => {
    const path = 'some/path';
    const tree = ['second', 'third', 'first'];

    ls.withArgs(path).yields(null, tree);

    listFiles(path)
      .then((result) => {
        result.should.deep.equal(['first', 'second', 'third']);
        done();
      })
      .catch(done);
  });
});
