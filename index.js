var fs = require("fs");
var http = require("http");
var WebSocketServer = require("websocket").server;
var winston = require('winston');
var _ = require('lodash');

var SocketEvent = require('./SocketEvent.js');
var ClientManager = require('./ClientManager.js');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({'timestamp':true}),
        new (winston.transports.File)({ filename: 'server.log' })
    ]
});

var httpServer = http.createServer(function(req, res) {
    res.writeHead(500);
});

var webSocketServer = new WebSocketServer({
    httpServer: httpServer,
    autoAcceptConnections: false,
    keepaliveInterval: 10*1000,
    keepaliveGracePeriod: 5*1000
});

var manager = new ClientManager();

function originIsAllowed(origin) {
    // TODO: put logic here to detect whether the specified origin is allowed.
    return true;
}

function handleMessage(connection, event) {
    if(event.type == 'register') {
        manager.register(connection, event.data);
    }
}

function broadcast() {

}

webSocketServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
        request.reject();
        logger.warn('Connection from origin ' + request.origin + ' using address ' + request.remoteAddress + ' rejected.');
        return;
    } else {
        var connection = request.accept(null, request.origin);

        connection.on("message", function (message) {
            if(message.type !== 'utf8') return;
            // echo the message
            connection.sendUTF(message.utf8Data);

            //var event = new SocketEvent(connection, JSON.parse(message.utf8Data));
            //logger.info(event.type, event.data);

            //handleMessage(connection, event);
        });

        connection.on('close', function(reasonCode, description) {
            manager.unregister(connection);
            //logger.info('Client ' + connection.remoteAddress + ' disconnected. (Code ' + reasonCode + ' - ' + description  + ')');
        });

        connection.on('error', function(error) {
            logger.error(error);
        });
    }
});

httpServer.listen(4000);
logger.info("Server started on port " + httpServer.address().port);