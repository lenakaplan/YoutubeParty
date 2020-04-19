"use strict";
process.title = 'youtube-party';
const PORT = process.env.PORT || 3000;

var webSocketServer = require('websocket').server;
var uuid = require('uuid');
var express = require('express');

var clients = [ ];

const server = express()
    .use(express.static('client'))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

var wsServer = new webSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
    var connection = request.accept(null, request.origin);
    connection.id = uuid.v4();
    clients.push(connection);
    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function(message) {
        console.log("from" + " " + connection.id );
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].id !== connection.id) {
                console.log("to" + " " + clients[i].id );
                clients[i].send(message.utf8Data);
            }
        }
    });

    connection.on('close', function() {
        console.log((new Date()) + " Peer "
            + connection.remoteAddress + " disconnected.");
        clients = clients.filter(conn => conn.id !== connection.id);
    });
});












