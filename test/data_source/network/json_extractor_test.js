import { describe, it } from 'mocha';
import { assert, should } from 'chai';
import extractor from '../../../src/data_source/network/json_extractor';

should();

describe('data processor', () => {
  it('parses input', () => {
    const input = 'SP._input_(\'b\', {"key": "value"});\n' +
                  'SP._input_(\'cpd\', {"some":\n\t"other"});';

    const result = extractor.process(input);

    assert(result.b.should.have.property('key').equal('value'));
    assert(result.cpd.should.have.property('some').equal('other'));
  });
});
