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
        teamOrder: 5,
      },
    ];
    assert(drivers.should.deep.equal(expected));
  });


  it('assigns last years team order', () => {
    const input = {
      init: {
        Test_Race_1234: {
          Drivers: [
            {
              Name: 'VANDOORNE',
              Initials: 'VAN',
              FullName: 'S.VANDOORNE',
              Color: 'ff7b08',
              Team: 'McLaren',
              Num: '2',
            },
            {
              Name: 'RICCIARDO',
              Initials: 'RIC',
              FullName: 'D.RICCIARDO',
              Color: '000073',
              Team: 'Red Bull Racing',
              Num: '3',
            },
            {
              Name: 'VETTEL',
              Initials: 'VET',
              FullName: 'S.VETTEL',
              Color: 'c30000',
              Team: 'Ferrari',
              Num: '5',
            },
            {
              Name: 'RAIKKONEN',
              Initials: 'RAI',
              FullName: 'K.RAIKKONEN',
              Color: 'c30000',
              Team: 'Ferrari',
              Num: '7',
            },
            {
              Name: 'ALONSO',
              Initials: 'ALO',
              FullName: 'F.ALONSO',
              Color: 'ff7b08',
              Team: 'McLaren',
              Num: '14',
            },
          ],
        },
        T: 11534623000000,
        TY: 6,
      },
    };

    const drivers = driverParser.extractDrivers(input);
    const expected = [
      {
        tla: 'VAN',
        color: 'ff7b08',
        team: 'McLaren',
        number: '2',
        teamOrder: 5,
      },
      {
        tla: 'RIC',
        color: '000073',
        team: 'Red Bull Racing',
        number: '3',
        teamOrder: 1,
      },
      {
        tla: 'VET',
        color: 'c30000',
        team: 'Ferrari',
        number: '5',
        teamOrder: 2,
      },
      {
        tla: 'RAI',
        color: 'c30000',
        team: 'Ferrari',
        number: '7',
        teamOrder: 2,
      },

      {
        tla: 'ALO',
        color: 'ff7b08',
        team: 'McLaren',
        number: '14',
        teamOrder: 5,
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
