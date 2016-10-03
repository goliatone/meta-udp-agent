var kast = require('kast');

var config = {
    glue: '|',
    vars: '#',
    ttl: 60 * 60 * 1000, // services not seen in an hour are dead
    purge: 15 * 60 * 1000 //run purge job every 15 minutes

};

var purged = [];
var services = {};

var server = kast();

server.command('/alive', function (req, res) {
    var body = req.body = bodyParser(req.body, config);
    var id = getServiceId(body);

    if(services[id]){
        updateService(id, req);
        console.log('ping from service', id);
    } else {
        services[id] = {connection: req.connection, lastSeen: Date.now(), body: body};
        notify(services[id], 'added');
        console.log('Adding service', req);
    }

    res.send('This is Host B speaking! How can I help you?');
});

setTimeout(purgeServices, config.ttl);

console.log('Kast host, listening to port 1234');
console.log('---------------------------------');
server.listen(1234);


function bodyParser(body, config){
    var parts = body.split(config.glue);
    var out = {}, chunks;

    parts.map(function(chunk){
        chunks = chunk.split(config.vars);
        out[chunks[0]] = chunks[1];
    });

    return out;
}

function getServiceId(body){
    return body.uuid;
}

function updateService(id, req){
    var service = services[id];
    service.lastSeen = Date.now();
    var connection = service.connection;
    if(connection.remoteAddress === req.connection.remoteAddress) return;
    service.connection = req.connection.remoteAddress;
    notify(service, 'added');
}

function notify(service, action){
    console.log('-----------------------------');
    console.log('Service status updated: %s', action);
    console.log(service);
    console.log('-----------------------------');
}

function purgeServices(){
    var service,
        lastSeen,
        now = Date.now();
    Object.keys(services).map(function(serviceId){
        service = services[serviceId];
        lastSeen = service.lastSeen;
        if(now -  lastSeen > config.ttl){
            delete services[serviceId];
            purged.push(service);
            notify(service, 'removed')
        }
    });
}
