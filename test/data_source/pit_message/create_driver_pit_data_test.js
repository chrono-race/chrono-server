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
    assert(pd.stints[0].startLap.should.equal(0));
    assert(pd.stints[0].tyre.should.equal('M'));
  });

  it('should create second stint with both tyres', () => {
    const driverPitData = '315000,7,';
    const tyreData = 'SM';

    const pd = createDriverPitData(driverPitData, tyreData);
    assert(pd.currentStatus.should.equal(''));
    assert(pd.should.have.property('stints'));
    assert(pd.stints.length.should.equal(2));
    assert(pd.stints[0].startLap.should.equal(0));
    assert(pd.stints[0].tyre.should.equal('M'));
    assert(pd.stints[1].startLap.should.equal(8));
    assert(pd.stints[1].tyre.should.equal('S'));
  });

  it('assigns tyres to stints from beginning in case fewer tyres than stints', () => {
    const driverPitData = '315000,7,290000,14';
    const tyreData = 'SM';

    const pd = createDriverPitData(driverPitData, tyreData);
    assert(pd.currentStatus.should.equal(''));
    assert(pd.should.have.property('stints'));
    assert(pd.stints.length.should.equal(3));
    assert(pd.stints[0].startLap.should.equal(0));
    assert(pd.stints[0].tyre.should.equal('M'));
    assert(pd.stints[1].startLap.should.equal(8));
    assert(pd.stints[1].tyre.should.equal('S'));
    assert(pd.stints[2].startLap.should.equal(15));
    assert(pd.stints[2].tyre.should.equal(''));
  });

  it('assigns tyres to stints from beginning in case fewer stints than tyres', () => {
    const driverPitData = '315000,7';
    const tyreData = 'MSM';

    const pd = createDriverPitData(driverPitData, tyreData);
    assert(pd.currentStatus.should.equal(''));
    assert(pd.should.have.property('stints'));
    assert(pd.stints.length.should.equal(2));
    assert(pd.stints[0].startLap.should.equal(0));
    assert(pd.stints[0].tyre.should.equal('M'));
    assert(pd.stints[1].startLap.should.equal(8));
    assert(pd.stints[1].tyre.should.equal('S'));
  });
});
