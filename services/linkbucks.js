/*
	Linkbucks
	Hosts: linkbucks.com and another one that changes sometimes
		   NOTE: there is a bunch of other domains, but they usually
		   		 just redirect to linkbucks.com or the other domain
 */

const got = require('got');

const Service = require('../service.js');

let service = new Service('Linkbucks');
service.hosts = ['linkbucks.com', 'zatnawqy.net', 'zytpirwai.net'];

service.run = async function(url) {
	let response = await got(url);

	let lines = response.body.match(/[^\r\n]+/g);
	let startLine = -1;
	let endLine = -1;
	let found = false;
	let line = null;

	for (let i = 0; i < lines.length; i++) {
		line = lines[i];
		if (line.trim().startsWith('(function() {')) {
			startLine = i;
			continue;
		}
		if (line.trim().startsWith('})();')) {
			if (found) {
				// Found the right function block; exit
				endLine = i;
				break;
			}
			else {
				// Restart search...
				startLine = -1;
				continue;
			}
		}
		if (startLine === -1) {
			continue;
		}

		if (line.trim().startsWith('var f = window[\'init\' + \'Lb\' + \'js\' + \'\'];')) {
			found = true;
		}
	}

	if (startLine === -1 || endLine === -1) {
		throw new Error('The URL cannot be decrypted');
	}

	let block = lines.slice(startLine, endLine);
	let token = null;
	let authKey = null;
	let adUrl = null;
	let step = 1;

	for (let i = 0; i < block.length && step <= 2; i++) {
		line = block[i].trim();

		// Find token
		if (token == null && line.startsWith('Token')) {
			token = line.match(/Token: '([a-z0-9]+)',/)[1];

			continue;
		}

		// Find the ad url
		if (adUrl == null && line.startsWith('AdUrl')) {
			adUrl = line.match(/AdUrl: '(.+?)',/)[1];

			continue;
		}

		// Find auth key
		if (authKey == null && line.startsWith('params')) {
			authKey = +line.match(/ = (\d+)/)[1];

			// Next step is getting the salt
			step = 2;
			continue;
		}

		// Find auth key salt
		if (step === 2 && line.startsWith('params')) {
			let salt = +line.match(/ \+ (\d+);/)[1];
			authKey = authKey + salt;

			// This makes the loop stop
			step = 3;
		}
	}

	// Request the ad URL and pass the server-side check
	await got(adUrl);

	// Wait 5 seconds and make the call
	await sleep(5000);
	let call = 'http://www.linkbucks.com/intermission/loadTargetUrl?t=' + token + '&aK=' + authKey + '&a_b=false';

	response = await got(call);

	// Parse the JSON response
	response = JSON.parse(response.body);
	if (response['Success'] === true &&
		!response['AdBlockSpotted'] &&
		response['Url']
	) {
		return response['Url'];
	}
	else {
		throw new Error('The URL cannot be decrypted');
	}
};

function sleep(time){
	return new Promise(resolve => {
		setTimeout(resolve, time);
	});
}

module.exports = service;
