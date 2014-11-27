'use strict';

var FetchOptions = require('../../fetch/FetchOptions');

module.exports = function() {
	suite('defaults', function() {
		suite('.aggregate', function() {
			test('is collect for `many` cardinality', function() {
				new FetchOptions({}, 'many').aggregate.should.eql('collect');
			});
			test('is identity when none provided and one cardinality', function() {
				new FetchOptions({}, 'one').aggregate.should.eql('identity');
			});
			test('is count when provided', function() {
				new FetchOptions({ aggregate: 'count' }).aggregate.should.eql('count');
			});
			test('is collect when no cardinality provided', function() {
				new FetchOptions({}).aggregate.should.eql('collect');
			});
		});
		test('.retrieve is node', function() {
			new FetchOptions().retrieve.should.eql('id');
		});
	});
	suite('#resultPart', function() {
		test('no arg', function() {
			new FetchOptions().resultPart().toString().should.eql('collect(distinct id($self)) as ids');
		});
		test('with id', function() {
			new FetchOptions({ retrieve: 'id' }, 'one').resultPart().toString()
				.should.eql('id($self) as id');
		});
		test('with fields', function() {
			var fetchOptions = new FetchOptions({ retrieve: ['name'] }, 'one');
			fetchOptions.resultPart().toString()
				.should.eql('{ id: id($self), name: $self.`name` } as $self');
		});
		test('one field', function() {
			var fetchOptions = new FetchOptions({ retrieve: { field: 'name' } }, 'one');
			fetchOptions.resultPart().toString()
				.should.eql('$self.`name` as name');
		});
		test('count', function() {
			new FetchOptions({ aggregate: 'count' }).resultPart('market').toString()
				.should.eql('count(distinct market) as marketsCount');
		});
		test('collect', function() {
			new FetchOptions({}, 'many').resultPart().toString()
				.should.eql('collect(distinct id($self)) as ids');
		});
	});
};
