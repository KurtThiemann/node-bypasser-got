const urlModule = require('url');
const services  = require('./services.js');

module.exports = async function(url) {
    let service = findService(url);
    if(!service){
        throw new Error(`'URL '${url}' not recognized as supported'`);
    }
    let dest = await service.run(url);
    if(service.isGeneric){
        service = findService(dest);
        if(!service){
            return dest;
        }
        return await service.run(dest);
    }
    return dest;
};

function findService(url, generic = true) {
    let parsedUrl = urlModule.parse(url);
    if(!parsedUrl.hostname){
        throw new Error(`Invalid url '${url}'`);
    }
    let service = services.filter(s => {
        return Boolean(s.hosts.filter(h => h.endsWith(parsedUrl.hostname)).length);
    })[0];
    if(service){
        return service;
    }
    if(!generic){
        return null;
    }
    return services.filter(s => s.isGeneric)[0] || null;
}
