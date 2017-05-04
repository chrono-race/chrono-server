import { describe, it } from 'mocha';
import { assert, should } from 'chai';
import detector from '../../../src/data_source/page1/change_detector';

should();

describe('page1 change detector', () => {
  it('does not detect change for identical objects', () => {
    const page1 = {
      lapTime: 123.45,
      position: 4,
      s1Time: 23.456,
      s2Time: 34.567,
      s3Time: 45.678,
      gap: 34.56,
      interval: 12.34,
      timestamp: 123457,
    };

    assert(detector.isChanged(page1, page1).should.equal(false));
  });

  it('does not detect change for NaNs', () => {
    const page1 = {
      lapTime: 123.45,
      position: 4,
      s1Time: 23.456,
      s2Time: 34.567,
      s3Time: NaN,
      gap: NaN,
      interval: 12.34,
      timestamp: 123457,
    };

    assert(detector.isChanged(page1, page1).should.equal(false));
  });

  it('does not detect change where only difference is driver, lap number and timestamp', () => {
    const page1 = {
      lapTime: 123.45,
      position: 4,
      s1Time: 23.456,
      s2Time: 34.567,
      s3Time: 45.678,
      gap: 34.56,
      interval: 12.34,
      timestamp: 123457,
    };
    const page1Row = {
      lapTime: 123.45,
      position: 4,
      s1Time: 23.456,
      s2Time: 34.567,
      s3Time: 45.678,
      gap: 34.56,
      interval: 12.34,
      timestamp: 123490,
      driver: 'VAN',
      lapNumber: 4,
    };

    assert(detector.isChanged(page1, page1Row).should.equal(false));
  });

  it('detects change in each field', () => {
    const page1 = {
      lapTime: 123.45,
      position: 4,
      s1Time: 23.456,
      s2Time: 34.567,
      s3Time: 45.678,
      gap: 34.56,
      interval: 12.34,
      timestamp: 123457,
    };

    assert(detector.isChanged(page1, Object.assign({}, page1, { lapTime: 100.00 }))
      .should.equal(true));
    assert(detector.isChanged(page1, Object.assign({}, page1, { position: 5 }))
      .should.equal(true));
    assert(detector.isChanged(page1, Object.assign({}, page1, { s1Time: 10.000 }))
      .should.equal(true));
    assert(detector.isChanged(page1, Object.assign({}, page1, { s2Time: 10.000 }))
      .should.equal(true));
    assert(detector.isChanged(page1, Object.assign({}, page1, { s3Time: 10.000 }))
      .should.equal(true));
    assert(detector.isChanged(page1, Object.assign({}, page1, { gap: 30.00 }))
      .should.equal(true));
    assert(detector.isChanged(page1, Object.assign({}, page1, { interval: 10.00 }))
      .should.equal(true));
  });
});
