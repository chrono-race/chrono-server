import { describe, it } from 'mocha';
import { assert, should, expect } from 'chai';
import eventGeneratorFactory from '../../../src/data_source/race_meta_data/event_generator';

should();

describe('race_mete_data event generator', () => {
  it('generate an event when race name is available', () => {
    const eventGenerator = eventGeneratorFactory.initialise();

    const events = eventGenerator({ name: 'My Race' });

    assert(events.length.should.equal(1));
    assert(events[0].type.should.equal('race_meta_data'));
    assert(events[0].name.should.equal('My Race'));
    assert(expect(events[0].totalLaps).to.be.NaN);
  });

  it('generate an event when total laps is available', () => {
    const eventGenerator = eventGeneratorFactory.initialise();

    const events = eventGenerator({ totalLaps: 51 });

    assert(events.length.should.equal(1));
    assert(events[0].type.should.equal('race_meta_data'));
    assert(expect(events[0].name).to.be.null);
    assert(events[0].totalLaps.should.equal(51));
  });

  it('generate an event when both race name and total laps are available', () => {
    const eventGenerator = eventGeneratorFactory.initialise();

    const events = eventGenerator({ name: 'My Race', totalLaps: 51 });

    assert(events.length.should.equal(1));
    assert(events[0].type.should.equal('race_meta_data'));
    assert(events[0].name.should.equal('My Race'));
    assert(events[0].totalLaps.should.equal(51));
  });

  it('does not generate an event when race name or total laps does not change', () => {
    const eventGenerator = eventGeneratorFactory.initialise();

    eventGenerator({ name: 'My Race' });
    eventGenerator({ totalLaps: 51 });

    let events = eventGenerator({ name: 'My Race' });
    assert(events.length.should.equal(0));

    events = eventGenerator({ totalLaps: 51 });
    assert(events.length.should.equal(0));

    events = eventGenerator({ name: 'My Race', totalLaps: 51 });
    assert(events.length.should.equal(0));
  });
});
