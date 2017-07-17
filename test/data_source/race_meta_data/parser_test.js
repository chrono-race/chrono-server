import { describe, it } from 'mocha';
import { assert, should, expect } from 'chai';
import raceMetaDataParser from '../../../src/data_source/race_meta_data/parser';

should();

describe('racename parser', () => {
  it('should not crash when data is not present', () => {
    let input = {};

    let raceMetaData = raceMetaDataParser.parse(input);
    assert(raceMetaData.name.should.equal('UNKNOWN'));
    assert(expect(raceMetaData.totalLaps).to.be.NaN);

    input = {
      f: {},
    };

    raceMetaData = raceMetaDataParser.parse(input);
    assert(raceMetaData.name.should.equal('UNKNOWN'));
    assert(expect(raceMetaData.totalLaps).to.be.NaN);

    input = {
      f: {
        free: {},
      },
    };

    raceMetaData = raceMetaDataParser.parse(input);
    assert(raceMetaData.name.should.equal('UNKNOWN'));
    assert(expect(raceMetaData.totalLaps).to.be.NaN);
  });

  it('should extract race name', () => {
    const input = {
      f: {
        free: {
          R: 'My Race',
        },
      },
    };

    const raceMetaData = raceMetaDataParser.parse(input);
    assert(raceMetaData.name.should.equal('My Race'));
    assert(expect(raceMetaData.totalLaps).to.be.NaN);
  });

  it('should extract total laps', () => {
    const input = {
      f: {
        free: {
          TL: 51,
        },
      },
    };

    const raceMetaData = raceMetaDataParser.parse(input);
    assert(raceMetaData.name.should.equal('UNKNOWN'));
    assert(raceMetaData.totalLaps.should.equal(51));
  });

  it('should extract race name and total laps', () => {
    const input = {
      f: {
        free: {
          R: 'My Race',
          TL: 51,
        },
      },
    };

    const raceMetaData = raceMetaDataParser.parse(input);
    assert(raceMetaData.name.should.equal('My Race'));
    assert(raceMetaData.totalLaps.should.equal(51));
  });
});
