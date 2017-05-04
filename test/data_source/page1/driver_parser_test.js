import { describe, it } from 'mocha';
import { assert, should } from 'chai';
import driverParser from '../../../src/data_source/page1/driver_parser';

should();

describe('driver parser', () => {
  it('extracts a driver', () => {
    const input = {
      init: {
        Test_Race_1234: {
          Drivers: [
            {
              Name: 'VANDOORNE',
              Initials: 'VAN',
              Color: 'ff7b08',
              Team: 'McLaren',
              Num: 2,
            },
          ],
        },
        T: 123456,
        TY: 5,
      },
    };

    const drivers = driverParser.extractDrivers(input);
    const expected = [
      {
        tla: 'VAN',
        color: 'ff7b08',
        team: 'McLaren',
        number: 2,
      },
    ];
    assert(drivers.should.deep.equal(expected));
  });

  it('errors in case of multiple sessions', () => {
    const input = {
      init: {
        Test_Race_1234: {
          Drivers: [],
        },
        Test_Race_4567: { },
        T: 123456,
        TY: 5,
      },
    };

    assert.throws(() => driverParser.extractDrivers(input), 'Could not find session, multiple fields: Test_Race_1234, Test_Race_4567');
  });

  it('errors in case of no sessions', () => {
    const input = {
      init: {
        T: 123456,
        TY: 5,
      },
    };

    assert.throws(() => driverParser.extractDrivers(input), 'Could not find session, no fields found in block');
  });
});
