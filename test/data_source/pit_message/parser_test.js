import { describe, it } from 'mocha';
import { assert, should } from 'chai';
import pitMessageParser from '../../../src/data_source/pit_message/parser';

should();

describe('pit message parser', () => {
  it('should return null in case of no x data block', () => {
    const input = { };

    const pitData = pitMessageParser.parse(input);

    assert.isNull(pitData);
  });
});
