const fs   = require('fs');
const path = require('path');

// Loop through file and create a services array
let files = fs.readdirSync(path.join(__dirname, 'services'));
let services = [];

files.forEach(function(file) {
	if (file.match(/.*\.js/i)) {
		let mod = require('./services/' + file);
		services.push(mod);
	}
});

module.exports = services;
