/*
	AdFoc.us
	Hosts: adfoc.us
 */

const got = require('got');

const Service = require('../service.js');

let service = new Service('AdFoc.us');
service.hosts = ['adfoc.us'];

service.run = async function(url) {
	let options = {
		headers: {
			Accept: 'text/html'
		}
	};

	let response = await got(url, options);

	let match = response.body.match(/click_url = "(.+?)";/);
	if (!match) {
		throw new Error(`The URL '${url}' cannot be decrypted`);
	}

	return match[1];
};

module.exports = service;
