import sinon from 'sinon';
import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert, should } from 'chai';
import fs from 'fs';
import date from 'date-and-time';
import winston from 'winston';
import archiver from '../../src/data_source/archiver';
import wrapper from '../../src/data_source/filesystem/fs_utils';

should();

describe('archiver', () => {
  describe('startArchiver', () => {
    let mkdirs;
    let format;

    beforeEach(() => {
      mkdirs = sinon.stub(wrapper, 'mkdirs');
      format = sinon.stub(date, 'format');
    });

    afterEach(() => {
      mkdirs.restore();
      format.restore();
    });

    it('creates new directory using current time', () => {
      format.returns('2017-04-11_1800');
      const session = archiver();

      assert(mkdirs.calledWith('sessions/2017-04-11_1800'));
      session.should.have.property('path').equal('sessions/2017-04-11_1800');
    });
  });

  describe('session', () => {
    describe('logFile', () => {
      let format;
      let writeFileSync;
      let error;

      beforeEach(() => {
        format = sinon.stub(date, 'format');
        writeFileSync = sinon.stub(fs, 'writeFileSync');
        error = sinon.stub(winston, 'error');
      });

      afterEach(() => {
        format.restore();
        writeFileSync.restore();
        error.restore();
      });

      it('writes a file to disk', () => {
        const fileContents = 'file contents';

        format.returns('2017-04-11_1800');

        const session = archiver();
        session.logFile('file.js', fileContents);

        assert(writeFileSync.calledWith('sessions/2017-04-11_1800/file.js', fileContents));
      });

      it('replaces illegal characters in filename', () => {
        const fileContents = 'file contents';

        format.returns('2017-04-11_1800');

        const session = archiver();
        session.logFile('file.js?1234', fileContents);

        assert(writeFileSync.calledWith('sessions/2017-04-11_1800/file.js_1234', fileContents));
      });

      it('logs in case of error writing file', () => {
        const fileContents = 'file contents';

        format.returns('2017-04-11_1800');
        writeFileSync.withArgs('sessions/2017-04-11_1800/file.js_1234', fileContents).throws('file write error');

        const session = archiver();
        session.logFile('file.js?1234', fileContents);

        assert(error.calledWith('Error writing file sessions/2017-04-11_1800/file.js_1234: file write error'));
      });
    });
  });
});
