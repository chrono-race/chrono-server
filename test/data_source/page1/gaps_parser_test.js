import { describe, it } from 'mocha';
import { assert, should } from 'chai';
import gapsParser from '../../../src/data_source/page1/gaps_parser';

should();

describe('gaps parser', () => {
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

  it('returns null in case no gap structure', () => {
    const input = { };
    const gaps = gapsParser.parse(drivers, input);

    assert.isNull(gaps);
  });

  it('errors in case size of driver lists disagrees', () => {
    const input = {
      sq: {
        Test_Race_1234: {
          DR: [
            {}, {},
          ],
        },
      },
    };
    assert.throws(() => gapsParser.parse(drivers, input), 'Expected 3 drivers in sq block but found 2');
  });

  it('parses driver gaps', () => {
    const input = {
      sq: {
        Test_Race_1234: {
          DR: [
            {
              G: '0.0414,,,,',
            },
            {
              G: '55.7435,38.381,15.724,,',
            },
            {
              G: '56.1654,,,,',
            },
          ],
        },
      },
    };
    const gaps = gapsParser.parse(drivers, input);

    assert(gaps.should.have.property('VAN'));
    assert(gaps.VAN.should.have.property('lapsCompleted'));
    assert(gaps.VAN.lapsCompleted.should.equal(0.0414));

    assert(gaps.should.have.property('ALO'));
    assert(gaps.ALO.should.have.property('lapsCompleted'));
    assert(gaps.ALO.lapsCompleted.should.equal(55.7435));

    assert(gaps.should.have.property('VET'));
    assert(gaps.VET.should.have.property('lapsCompleted'));
    assert(gaps.VET.lapsCompleted.should.equal(56.1654));
  });
});
