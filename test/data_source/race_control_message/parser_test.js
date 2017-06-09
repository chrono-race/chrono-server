import { describe, it } from 'mocha';
import { assert, should } from 'chai';
import raceControlMessageParser from '../../../src/data_source/race_control_message/parser';

should();

describe('race control message parser', () => {
  it('should extract a message', () => {
    const input = {
      c: {
        Race_1234: {
          M: 'TURN 2 INCIDENT INVOLVING CARS 19 (MAS) AND 14 (ALO) NOTED - FORCING ANOTHER DRIVER OFF THE TRACK',
        },
        T: 11534983599006,
      },
    };

    const raceControlMessages = raceControlMessageParser.parse(input);

    assert(raceControlMessages.message.should.equal('TURN 2 INCIDENT INVOLVING CARS 19 (MAS) AND 14 (ALO) NOTED - FORCING ANOTHER DRIVER OFF THE TRACK'));
    assert(raceControlMessages.timestamp.should.equal(11534983));
  });

  it('should return undefined in case of no message', () => {
    const input = {
      c: {
        Race_1234: {
        },
      },
    };

    const raceControlMessages = raceControlMessageParser.parse(input);

    assert.isUndefined(raceControlMessages.message, undefined);
  });

  it('should return undefined in case of no c block', () => {
    const input = {
    };

    const raceControlMessages = raceControlMessageParser.parse(input);

    assert.isUndefined(raceControlMessages.message, undefined);
  });
});

