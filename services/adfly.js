/*
	Adf.ly
	Hosts: adf.ly
*/

const got = require('got');

const Service = require('../service.js');

let service = new Service('Adf.ly');
service.hosts = ['adf.ly', 'xterca.net'];

service.run = async function(url) {
	let response = await got(url);

	let match = response.body.match(/var ysmm = '(.*?)';/);
	if (!match) {
		throw new Error(`The URL '${url}' cannot be decrypted`);
	}
	let ysmm = match[1];
	let a = '';
	let b = '';
	for (let i = 0; i < ysmm.length; ++i) {
		if (i % 2 === 0) {
			a = a + ysmm.charAt(i);
		} else {
			b = ysmm.charAt(i) + b;
		}
	}
	ysmm = a + b;
	a = ysmm.split('');
	for (let i = 0; i < a.length; ++i) {
		if (/\d/.test(a[i])) {
			for (let j = i + 1; j < a.length; ++j) {
				if (/\d/.test(a[j])) {
					b = a[i] ^ a[j];
					if (b < 10) {
						a[i] = b;
					}
					i = j;
					j = a.length;
				}
			}
		}
	}

	ysmm = a.join('');
	ysmm = Buffer.from(ysmm, 'base64').toString('ascii');
	ysmm = ysmm.substring(16);
	ysmm = ysmm.substring(0, ysmm.length - 16);

	return ysmm;
};

module.exports = service;
