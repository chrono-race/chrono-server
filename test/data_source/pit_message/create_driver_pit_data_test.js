import { describe, it } from 'mocha';
import { assert, should } from 'chai';
import createDriverPitData from '../../../src/data_source/pit_message/create_driver_pit_data';

should();

describe('create driver pit data', () => {
  it('should return pit entry at end of first stint for 0,0', () => {
    const driverPitData = '0,0';
    const tyreData = 'M';

    const pd = createDriverPitData(driverPitData, tyreData);
    assert(pd.currentStatus.should.equal('in pit'));
    assert(pd.should.have.property('stints'));
    assert(pd.stints.length.should.equal(1));
    assert(pd.stints[0].startLap.should.equal(1));
    assert(pd.stints[0].tyre.should.equal('M'));
  });
});
