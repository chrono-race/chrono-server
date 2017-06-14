import { describe, it } from 'mocha';
import { assert, should } from 'chai';
import pitMessageParser from '../../../src/data_source/pit_message/parser';

should();

describe('pit message parser', () => {
  const drivers = [
    {
      tla: 'VAN',
    },
    {
      tla: 'ALO',
    },
    {
      tla: 'VET',
    },
  ];

  it('should return null in case of no x data block', () => {
    const input = { };

    const pitData = pitMessageParser.parse(drivers, input);

    assert.isNull(pitData);
  });

  it('errors in case size of driver list disagrees', () => {
    const input = {
      x: {
        Test_Race_1234: {
          DR: [
            { }, { },
          ],
        },
      },
    };

    assert.throws(() => pitMessageParser.parse(drivers, input), 'Expected 3 drivers in x block but found 2');
  });

  it('parses empty pit data as missing data for driver', () => {
    const singleDriver = [{
      tla: 'VET',
    }];
    const input = {
      x: {
        Test_Race_1234: {
          DR: [
            {
              X: ',15,20,,,0,89.771,92.926,0.0,M,,,',
              TI: '5,3,3,',
              PD: '',
            },
          ],
        },
      },
    };

    const pitData = pitMessageParser.parse(singleDriver, input);

    assert(pitData.should.not.have.property('VET'));
  });

  it('parses 0,0 as pit entry at end of first stint', () => {
    const singleDriver = [{
      tla: 'VET',
    }];
    const input = {
      x: {
        Test_Race_1234: {
          DR: [
            {
              X: ',15,20,,,0,89.771,92.926,0.0,M,,,',
              TI: '5,3,3,',
              PD: '0,0',
            },
          ],
        },
      },
    };

    const pitData = pitMessageParser.parse(singleDriver, input);

    assert(pitData.should.have.property('VET'));
    assert(pitData.VET.currentStatus.should.equal('in pit'));
    assert(pitData.VET.should.have.property('stints'));
    assert(pitData.VET.stints.length.should.equal(1));
    assert(pitData.VET.stints[0].startLap.should.equal(0));
    assert(pitData.VET.stints[0].tyre.should.equal('M'));
  });
});
