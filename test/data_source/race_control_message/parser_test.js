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
      },
    };

    const raceControlMessages = raceControlMessageParser.parse(input);

    assert(raceControlMessages.message.should.equal('TURN 2 INCIDENT INVOLVING CARS 19 (MAS) AND 14 (ALO) NOTED - FORCING ANOTHER DRIVER OFF THE TRACK'));
  });
});

