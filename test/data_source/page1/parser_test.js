import { describe, it } from 'mocha';
import { assert, should } from 'chai';
import page1Parser from '../../../src/data_source/page1/parser';

should();

describe('page 1 parser', () => {
  it('errors in case number of driver records does not agree', () => {
    const drivers = [
      {
        tla: 'VAN',
      },
      {
        tla: 'ALO',
      },
    ];
    const input = {
      o: {
        Test_Race_1234: {
          DR: [
            {
              O: '',
            },
          ],
        },
      },
    };

    assert.throws(() => page1Parser.parse(drivers, input), 'Expected 2 drivers in page one but found 1');
  });

  it('parses single driver without init block', () => {
    const drivers = [
      {
        tla: 'VAN',
      },
    ];
    const input = {
      o: {
        Test_Race_1234: {
          DR: [
            {
              O: ',97.259,WWWWWWWWWW,0.0,5,30.807,35.123,15.321,,3.122,238,228,218,311,0.608,1,',
            },
          ],
        },
        T: 8490908895004,
      },
    };

    const page1 = page1Parser.parse(drivers, input);

    assert(page1.should.have.property('VAN'));
    assert(page1.VAN.lapTime.should.equal(97.259));
    assert(page1.VAN.position.should.equal(5));
    assert(page1.VAN.s1Time.should.equal(30.807));
    assert(page1.VAN.s2Time.should.equal(35.123));
    assert(page1.VAN.s3Time.should.equal(15.321));
    assert(page1.VAN.gap.should.equal(3.122));
    assert(page1.VAN.speed1.should.equal(238));
    assert(page1.VAN.speed2.should.equal(228));
    assert(page1.VAN.speed3.should.equal(218));
    assert(page1.VAN.speedTrap.should.equal(311));
    assert(page1.VAN.interval.should.equal(0.608));
    assert(page1.VAN.timestamp.should.equal(8490909));
  });

  it('parses multiple drivers without init block', () => {
    const drivers = [
      {
        tla: 'VAN',
      },
      {
        tla: 'ALO',
      },
      {
        tla: 'HAM',
      },
    ];

    const input = {
      o: {
        Test_Race_1234: {
          DR: [
            {
              O: ',97.259,WWWWWWWWWW,0.0,5,30.807,35.123,15.321,,3.122,238,228,218,311,0.608,1,',
            },
            {
              O: ',99.648,GGGWWWWWWY,3.0,3,26.172,29.227,,,7.340,268,262,,299,4.579,0,',
            },
            {
              O: ',99.724,GYGWWWPWWY,4.0,5,26.12,29.63,,,8.421,278,272,,332,0.548,0,',
            },
          ],
        },
      },
    };

    const page1 = page1Parser.parse(drivers, input);

    assert(page1.should.have.property('VAN'));
    assert(page1.VAN.lapTime.should.equal(97.259));
    assert(page1.VAN.position.should.equal(5));
    assert(page1.VAN.s1Time.should.equal(30.807));
    assert(page1.VAN.s2Time.should.equal(35.123));
    assert(page1.VAN.s3Time.should.equal(15.321));
    assert(page1.VAN.gap.should.equal(3.122));
    assert(page1.VAN.speed1.should.equal(238));
    assert(page1.VAN.speed2.should.equal(228));
    assert(page1.VAN.speed3.should.equal(218));
    assert(page1.VAN.speedTrap.should.equal(311));
    assert(page1.VAN.interval.should.equal(0.608));

    assert(page1.should.have.property('ALO'));
    assert(page1.ALO.lapTime.should.equal(99.648));

    assert(page1.should.have.property('HAM'));
    assert(page1.HAM.lapTime.should.equal(99.724));
  });

  it('parses multiple drivers with init block', () => {
    const drivers = [
      {
        tla: 'VAN',
      },
      {
        tla: 'RIC',
      },
      {
        tla: 'VET',
      },
    ];

    const input = {
      init: {
        Test_Race_5678: {
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
          ],
        },
      },
      o: {
        Test_Race_1234: {
          DR: [
            {
              O: ',97.259,WWWWWWWWWW,0.0,5,30.807,35.123,15.321,,3.122,238,228,218,311,0.608,1,',
            },
            {
              O: ',99.648,GGGWWWWWWY,3.0,3,26.172,29.227,,,7.340,268,262,,299,4.579,0,',
            },
            {
              O: ',99.724,GYGWWWPWWY,4.0,5,26.12,29.63,,,8.421,278,272,,332,0.548,0,',
            },
          ],
        },
      },
    };

    const page1 = page1Parser.parse(drivers, input);

    assert(page1.should.have.property('VAN'));
    assert(page1.VAN.lapTime.should.equal(97.259));

    assert(page1.should.have.property('RIC'));
    assert(page1.RIC.lapTime.should.equal(99.648));

    assert(page1.should.have.property('VET'));
    assert(page1.VET.lapTime.should.equal(99.724));
  });

  it('error in case drivers in init block disagree with given drivers', () => {
    const drivers = [
      {
        tla: 'VAN',
      },
      {
        tla: 'RIC',
      },
      {
        tla: 'VET',
      },
    ];

    const input = {
      init: {
        Test_Race_5678: {
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
              Name: 'VETTEL',
              Initials: 'VET',
              FullName: 'S.VETTEL',
              Color: 'c30000',
              Team: 'Ferrari',
              Num: '5',
            },
            {
              Name: 'RICCIARDO',
              Initials: 'RIC',
              FullName: 'D.RICCIARDO',
              Color: '000073',
              Team: 'Red Bull Racing',
              Num: '3',
            },
          ],
        },
      },
      o: {
        Test_Race_1234: {
          DR: [
            {
              O: ',97.259,WWWWWWWWWW,0.0,5,30.807,35.123,15.321,,3.122,238,228,218,311,0.608,1,',
            },
            {
              O: ',99.648,GGGWWWWWWY,3.0,3,26.172,29.227,,,7.340,268,262,,299,4.579,0,',
            },
            {
              O: ',99.724,GYGWWWPWWY,4.0,5,26.12,29.63,,,8.421,278,272,,332,0.548,0,',
            },
          ],
        },
      },
    };

    assert.throws(() => page1Parser.parse(drivers, input), 'Driver order mismatch in page 1. Expected VAN, RIC, VET but got VAN, VET, RIC');
  });

  it('returns undefined in case there is no page 1 structure', () => {
    const page1 = page1Parser.parse([], {});

    assert.isNull(page1);
  });
});
