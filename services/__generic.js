/*
	Generic / Unknown services
 */

const got = require('got');
const urlModule = require('url');

const Service = require('../service.js');

let service = new Service('Generic');
service.isGeneric = true;

service.run = async function(url) {
	let options = {
		url: url,
		followRedirect: false,
		throwHttpErrors: false
	};
	let response = await got(url, options);
	if (!([301, 302].includes(response.statusCode)) || !response.headers.location) {
		throw new Error('URL not recognized as supported');
	}
	return (new urlModule.URL(String(response.headers.location), url)).href;
};

module.exports = service;
