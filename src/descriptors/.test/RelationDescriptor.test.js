"use strict";

var $relation = require('..').relation;

module.exports = function() {
	suite('basic', function() {
		var fetchDescriptor;
		setup(function() {
			fetchDescriptor = $relation({
				type: 'COVERS',
				related: { label: 'Market' }
			});
		});
		test('#matchPart', function() {
			fetchDescriptor.matchPart().toString().should.eql('$self-[:COVERS]->(market:Market)')
		});
		test('#resultPart', function() {
			fetchDescriptor.resultPart().toString().should.eql('collect(distinct id(market)) as marketIds');
		});
	});
	suite('relation to-one', function() {
		var fetchDescriptor;
		setup(function() {
			fetchDescriptor = $relation({
				type: 'SOLD_BY',
				related: { label: 'Competitor' },
				cardinality: 'one'
			});
		});
		test('#matchPart', function() {
			fetchDescriptor.matchPart().toString().should.eql('$self-[:SOLD_BY]->(competitor:Competitor)')
		});
		test('#resultPart', function() {
			fetchDescriptor.resultPart().toString().should.eql('id(competitor) as competitorId');
		});
	});
	suite('complex', function() {
		var fetchDescriptor;
		setup(function() {
			fetchDescriptor = $relation({
				self: { label: 'Competitor' },
				type: 'SOLD_BY',
				direction: 'inbound',
				related: { label: 'CompetitorProduct', alias: 'product' },
				fetch: { aggregate: 'count' }
			});
		});
		test('#matchPart', function() {
			fetchDescriptor.matchPart().toString()
				.should.eql('(competitor:Competitor)<-[:SOLD_BY]-(product:CompetitorProduct)')
		});
		test('#resultPart', function() {
			fetchDescriptor.resultPart().toString().should.eql('count(distinct product) as productsCount');
		});
	});
};
