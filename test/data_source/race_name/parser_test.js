import { describe, it } from 'mocha';
import { assert, should } from 'chai';
import racenameParser from '../../../src/data_source/race_name/parser';

should();

describe('racename parser', () => {

  it('should not crash when data is not present', () => {
	  var input = {};

    var racename = racenameParser.parse(input);
    assert(racename.name.should.equal('UNKNOWN'));

   	input = {
   		f:{},
   	};

    racename = racenameParser.parse(input);
    assert(racename.name.should.equal('UNKNOWN'));

   	input = {
   		f:{
   			free:{},
   		},
   	};

    racename = racenameParser.parse(input);
    assert(racename.name.should.equal('UNKNOWN'));

  });

  it('should extract racename', () => {
   	const input = {
   		f:{
   			free:{
   				R:'My Race',
   			},
   		},
   	};

    const racename = racenameParser.parse(input);
    assert(racename.name.should.equal('My Race'));
  });
});
