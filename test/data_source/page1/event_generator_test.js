import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert, should } from 'chai';
import sinon from 'sinon';
import winston from 'winston';
import page1EventGenerator from '../../../src/data_source/page1/event_generator';
import page1ChangeDetector from '../../../src/data_source/page1/change_detector';

should();

describe('page 1 event generator', () => {
  let isChanged;
  let warn;

  beforeEach(() => {
    isChanged = sinon.stub(page1ChangeDetector, 'isChanged');
    warn = sinon.stub(winston, 'warn');
  });

  afterEach(() => {
    isChanged.restore();
    warn.restore();
  });

  it('emits nothing in case no drivers', () => {
    const gaps = {};
    const page1 = {};

    const generator = page1EventGenerator.initialise();
    const events = generator.updateWith(gaps, page1);

    assert(events.should.be.empty);
  });

  it('emits nothing initially if neither page 1 nor gaps received but logs warning', () => {
    const generator = page1EventGenerator.initialise();
    const events = generator.updateWith(undefined, undefined);

    assert(events.length.should.equal(0));
    assert(warn.calledWith('Neither page 1 nor gaps received yet'));
  });

  it('emits nothing initially if only page 1 received but logs warning', () => {
    const page1 = {
      VAN: {
        lapTime: 123.45,
        position: 4,
        s1Time: 23.456,
        s2Time: 34.567,
        s3Time: 45.678,
        gap: 34.56,
        interval: 12.34,
        timestamp: 123456,
      },
    };

    const generator = page1EventGenerator.initialise();
    const events = generator.updateWith(undefined, page1);

    assert(events.length.should.equal(0));
    assert(warn.calledWith('Page 1 received but no gaps received yet'));
  });

  it('emits nothing initially if only gaps received but logs warning', () => {
    const gaps = {
      VAN: {
        lapsCompleted: 3.1,
      },
    };

    const generator = page1EventGenerator.initialise();
    const events = generator.updateWith(gaps, undefined);

    assert(events.length.should.equal(0));
    assert(warn.calledWith('Gaps received but no page 1 received yet'));
  });

  it('emits one event per driver initially when both page 1 and gaps received', () => {
    const gaps = {
      VAN: {
        lapsCompleted: 3.1,
      },
      HAM: {
        lapsCompleted: 3.2,
      },
    };
    const page1 = {
      VAN: {
        lapTime: 123.45,
        position: 4,
        s1Time: 23.456,
        s2Time: 34.567,
        s3Time: 45.678,
        gap: 34.56,
        interval: 12.34,
        timestamp: 123456,
      },
      HAM: {
        lapTime: NaN,
        position: 1,
        s1Time: 23.001,
        s2Time: NaN,
        s3Time: NaN,
        gap: NaN,
        interval: NaN,
        timestamp: 123457,
      },
    };

    const generator = page1EventGenerator.initialise();
    const events = generator.updateWith(gaps, page1);

    assert(events.length.should.equal(2));

    assert(events[0].driver.should.equal('VAN'));
    assert(events[0].lapNumber.should.equal(3));
    assert(events[0].lapTime.should.equal(123.45));
    assert(events[0].s1Time.should.equal(23.456));
    assert(events[0].s2Time.should.equal(34.567));
    assert(events[0].s3Time.should.equal(45.678));
    assert(events[0].gap.should.equal(34.56));
    assert(events[0].interval.should.equal(12.34));
    assert(events[0].timestamp.should.equal(123456));

    assert(events[1].driver.should.equal('HAM'));
    assert(events[1].lapNumber.should.equal(4));
    assert(events[1].lapTime.should.be.NaN);
    assert(events[1].position.should.equal(1));
    assert(events[1].s1Time.should.equal(23.001));
    assert(events[1].s2Time.should.be.NaN);
  });

  it('emits initial event when first page 1 received after first gaps', () => {
    const gaps = {
      VAN: {
        lapsCompleted: 3.1,
      },
    };
    const page1 = {
      VAN: {
        lapTime: 123.45,
        position: 4,
        s1Time: 23.456,
        s2Time: 34.567,
        s3Time: 45.678,
        gap: 34.56,
        interval: 12.34,
        timestamp: 123456,
      },
    };

    const generator = page1EventGenerator.initialise();
    const events1 = generator.updateWith(gaps, undefined);
    assert(events1.length.should.equal(0));

    const events2 = generator.updateWith(undefined, page1);
    assert(events2.length.should.equal(1));
  });

  it('emits initial event when first gaps received after first page 1', () => {
    const gaps = {
      VAN: {
        lapsCompleted: 3.1,
      },
    };
    const page1 = {
      VAN: {
        lapTime: 123.45,
        position: 4,
        s1Time: 23.456,
        s2Time: 34.567,
        s3Time: 45.678,
        gap: 34.56,
        interval: 12.34,
        timestamp: 123456,
      },
    };

    const generator = page1EventGenerator.initialise();
    const events1 = generator.updateWith(undefined, page1);
    assert(events1.length.should.equal(0));

    const events2 = generator.updateWith(gaps, undefined);
    assert(events2.length.should.equal(1));
  });

  it('emits nothing after initial update when change in gaps received', () => {
    const initialGaps = {
      VAN: {
        lapsCompleted: 3.1,
      },
    };
    const page1 = {
      VAN: {
        lapTime: 123.45,
        position: 4,
        s1Time: 23.456,
        s2Time: 34.567,
        s3Time: 45.678,
        gap: 34.56,
        interval: 12.34,
        timestamp: 123456,
      },
    };

    const updatedGaps = {
      VAN: {
        lapsCompleted: 3.2,
      },
    };

    const generator = page1EventGenerator.initialise();
    generator.updateWith(initialGaps, page1);
    const events = generator.updateWith(updatedGaps, undefined);

    assert(events.length.should.equal(0));
  });

  it('emits nothing after initial update when updated page 1 contains no changes', () => {
    const gaps = {
      VAN: {
        lapsCompleted: 3.1,
      },
    };
    const page1 = {
      VAN: {
        lapTime: 123.45,
        position: 4,
        s1Time: 23.456,
        s2Time: 34.567,
        s3Time: 45.678,
        gap: 34.56,
        interval: 12.34,
        timestamp: 123456,
      },
    };

    isChanged.returns(false);

    const generator = page1EventGenerator.initialise();
    generator.updateWith(gaps, page1);
    const events = generator.updateWith(gaps, page1);

    assert(events.length.should.equal(0));
  });

  it('emits nothing after initial update when updated page 1 undefined', () => {
    const gaps = {
      VAN: {
        lapsCompleted: 3.1,
      },
    };
    const page1 = {
      VAN: {
        lapTime: 123.45,
        position: 4,
        s1Time: 23.456,
        s2Time: 34.567,
        s3Time: 45.678,
        gap: 34.56,
        interval: 12.34,
        timestamp: 123456,
      },
    };

    isChanged.returns(false);

    const generator = page1EventGenerator.initialise();
    generator.updateWith(gaps, page1);
    const events = generator.updateWith(gaps, undefined);

    assert(events.length.should.equal(0));
  });

  it('emits nothing after initial update when updated page 1 null', () => {
    const gaps = {
      VAN: {
        lapsCompleted: 3.1,
      },
    };
    const page1 = {
      VAN: {
        lapTime: 123.45,
        position: 4,
        s1Time: 23.456,
        s2Time: 34.567,
        s3Time: 45.678,
        gap: 34.56,
        interval: 12.34,
        timestamp: 123456,
      },
    };

    isChanged.returns(false);

    const generator = page1EventGenerator.initialise();
    generator.updateWith(gaps, page1);
    const events = generator.updateWith(gaps, null);

    assert(events.length.should.equal(0));
  });

  it('emits event after initial update when change in page1 detected', () => {
    const gaps = {
      VAN: {
        lapsCompleted: 3.1,
      },
    };
    const initialPage1 = {
      VAN: {
        lapTime: 123.45,
        position: 4,
        s1Time: 23.456,
        s2Time: 34.567,
        s3Time: NaN,
        gap: 34.56,
        interval: 12.34,
        timestamp: 123456,
      },
    };
    const updatedPage1 = {
      VAN: {
        lapTime: 123.45,
        position: 4,
        s1Time: 23.456,
        s2Time: 34.567,
        s3Time: 45.678,
        gap: 34.56,
        interval: 12.34,
        timestamp: 123457,
      },
    };

    isChanged.withArgs(initialPage1.VAN, sinon.match({ driver: 'VAN', position: 4, s3Time: 45.678 })).returns(true);

    const generator = page1EventGenerator.initialise();
    generator.updateWith(gaps, initialPage1);
    const events = generator.updateWith(gaps, updatedPage1);

    assert(events.length.should.equal(1));

    assert(events[0].driver.should.equal('VAN'));
    assert(events[0].lapNumber.should.equal(3));
    assert(events[0].lapTime.should.equal(123.45));
    assert(events[0].s3Time.should.equal(45.678));
    assert(events[0].timestamp.should.equal(123457));

    assert(isChanged.calledOnce);
  });

  it('subsequent event uses original gaps if updated gaps are undefined', () => {
    const gaps = {
      VAN: {
        lapsCompleted: 3.1,
      },
    };
    const initialPage1 = {
      VAN: {
        lapTime: 123.45,
        position: 4,
        s1Time: 23.456,
        s2Time: 34.567,
        s3Time: NaN,
        gap: 34.56,
        interval: 12.34,
        timestamp: 123456,
      },
    };
    const updatedPage1 = {
      VAN: {
        lapTime: 123.45,
        position: 4,
        s1Time: 23.456,
        s2Time: 34.567,
        s3Time: 45.678,
        gap: 34.56,
        interval: 12.34,
        timestamp: 123457,
      },
    };

    isChanged.withArgs(initialPage1.VAN, sinon.match({ driver: 'VAN', position: 4, s3Time: 45.678 })).returns(true);

    const generator = page1EventGenerator.initialise();
    generator.updateWith(gaps, initialPage1);
    const events = generator.updateWith(undefined, updatedPage1);

    assert(events.length.should.equal(1));

    assert(events[0].driver.should.equal('VAN'));
    assert(events[0].lapNumber.should.equal(3));
    assert(events[0].lapTime.should.equal(123.45));
    assert(events[0].s3Time.should.equal(45.678));
    assert(events[0].timestamp.should.equal(123457));

    assert(isChanged.calledOnce);
  });

  it('subsequent event uses original gaps if updated gaps are null', () => {
    const gaps = {
      VAN: {
        lapsCompleted: 3.1,
      },
    };
    const initialPage1 = {
      VAN: {
        lapTime: 123.45,
        position: 4,
        s1Time: 23.456,
        s2Time: 34.567,
        s3Time: NaN,
        gap: 34.56,
        interval: 12.34,
        timestamp: 123456,
      },
    };
    const updatedPage1 = {
      VAN: {
        lapTime: 123.45,
        position: 4,
        s1Time: 23.456,
        s2Time: 34.567,
        s3Time: 45.678,
        gap: 34.56,
        interval: 12.34,
        timestamp: 123457,
      },
    };

    isChanged.withArgs(initialPage1.VAN, sinon.match({ driver: 'VAN', position: 4, s3Time: 45.678 })).returns(true);

    const generator = page1EventGenerator.initialise();
    generator.updateWith(gaps, initialPage1);
    const events = generator.updateWith(null, updatedPage1);

    assert(events.length.should.equal(1));

    assert(events[0].driver.should.equal('VAN'));
    assert(events[0].lapNumber.should.equal(3));
    assert(events[0].lapTime.should.equal(123.45));
    assert(events[0].s3Time.should.equal(45.678));
    assert(events[0].timestamp.should.equal(123457));

    assert(isChanged.calledOnce);
  });

  it('subsequent event uses updated gaps if updated gaps are present', () => {
    const initialGaps = {
      VAN: {
        lapsCompleted: 3.1,
      },
    };
    const initialPage1 = {
      VAN: {
        lapTime: 123.45,
        position: 4,
        s1Time: 23.456,
        s2Time: 34.567,
        s3Time: NaN,
        gap: 34.56,
        interval: 12.34,
        timestamp: 123456,
      },
    };
    const updatedGaps = {
      VAN: {
        lapsCompleted: 4.2,
      },
    };
    const updatedPage1 = {
      VAN: {
        lapTime: 123.45,
        position: 4,
        s1Time: 23.456,
        s2Time: 34.567,
        s3Time: 45.678,
        gap: 34.56,
        interval: 12.34,
        timestamp: 123457,
      },
    };

    isChanged.withArgs(initialPage1.VAN, sinon.match({ driver: 'VAN', position: 4, s3Time: 45.678 })).returns(true);

    const generator = page1EventGenerator.initialise();
    generator.updateWith(initialGaps, initialPage1);
    const events = generator.updateWith(updatedGaps, updatedPage1);

    assert(events.length.should.equal(1));

    assert(events[0].driver.should.equal('VAN'));
    assert(events[0].lapNumber.should.equal(4));
    assert(events[0].lapTime.should.equal(123.45));
    assert(events[0].s3Time.should.equal(45.678));
    assert(events[0].timestamp.should.equal(123457));

    assert(isChanged.calledOnce);
  });
});
