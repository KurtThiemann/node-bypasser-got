/*jshint expr: true*/
const expect = require('chai').expect;

const bypass = require('../index.js');

describe('Decrypt', function() {
	this.timeout(0);

	it('Adf.ly', function(done) {
		bypass('http://zipansion.com/1JRAH')
			.then(result => {
				expect(result).to.equal('http://downloads.jingames.net/?iv=1.93&w=mc&n=nc&e=j&u=n&mv=0.7.8');
				done();
			})
			.catch(err => {
				done(err);
			});
	});

	it('Linkbucks', function(done) {
		bypass('http://www.linkbucks.com/AAqnD')
			.then(result => {
				expect(result).to.equal('http://github.com');
				done();
			})
			.catch(err => {
				done(err);
			});
	});

	it('AdFoc.us', function(done) {
		bypass('http://adfoc.us/x57045654')
			.then(result => {
				expect(result).to.equal('http://github.com');
				done();
			})
			.catch(err => {
				done(err);
			});
	});

	it('Generic goo.gl', function(done) {
		bypass('http://goo.gl/NWt4Es')
			.then(result => {
				expect(result).to.equal('http://github.com/');
				done();
			})
			.catch(err => {
				done(err);
			});
	});

	it('Generic custom bit.ly', function(done) {
		bypass('http://l.khoanguyen.me/1HBv4tx')
			.then(result => {
				expect(result).to.equal('http://github.com/');
				done();
			})
			.catch(err => {
				done(err);
			});
	});

});
