/**
 * Service entity with the implementation of link expansion
 * @param {String} name - Name of the service
 */
function Service(name) {
	this.name = name || null;
	this.hosts = [];
	this.run = null;
	this.isGeneric = false;
}

module.exports = Service;
