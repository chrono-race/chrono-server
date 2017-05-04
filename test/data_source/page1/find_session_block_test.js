import { describe, it } from 'mocha';
import { assert, should } from 'chai';
import findSessionBlock from '../../../src/data_source/page1/find_session_block';

should();

describe('find session block', () => {
  it('finds the only child', () => {
    const input = {
      Race_1234: { },
    };

    const result = findSessionBlock.from(input);

    assert(result.should.equal('Race_1234'));
  });

  it('ignores TY and T children', () => {
    const input = {
      Race_1234: { },
      TY: 12345,
      T: 1004,
    };

    const result = findSessionBlock.from(input);

    assert(result.should.equal('Race_1234'));
  });

  it('throws an error in case of no children', () => {
    const input = {
      TY: 12345,
      T: 1004,
    };

    (() => findSessionBlock.from(input)).should.throw('Could not find session, no fields found in block');
  });

  it('throws an error in case of multiple children', () => {
    const input = {
      Race_1: { },
      Race_2: { },
      TY: 12345,
      T: 1004,
    };

    (() => findSessionBlock.from(input)).should.throw('Could not find session, multiple fields: Race_1, Race_2');
  });
});
