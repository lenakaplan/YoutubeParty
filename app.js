"use strict";
// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'youtube-party';

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
// websocket and http servers
const { Server } = require('ws');



// var webSocketServer = require('websocket').server;
var uuid = require('uuid');
var express = require('express');

/**
 * Global variablesheruko
 */
// list of currently connected clients (users)
var clients = [ ];

const server = express()
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

// var wsServer = new webSocketServer({
//     httpServer: server
// });
const wss = new Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.id = uuid.v4();
    clients.push(ws);

    ws.on('message', function (message) {
        // broadcast message to all connected clients
        console.log("from" + " " + connection.id);
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].id !== connection.id) {
                console.log("to" + " " + clients[i].id);
                clients[i].send(message.utf8Data);
            }
        }
    });


    ws.on('close', () => {
        console.log((new Date()) + " Peer "
            + connection.remoteAddress + " disconnected.");
        // remove user from the list of connected clients
        clients = clients.filter(conn => conn.id !== connection.id);
    });
})
// wsServer.on('request', function(request) {
//     console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
//     var connection = request.accept(null, request.origin);
//     connection.id = uuid.v4();
//     clients.push(connection);
//     console.log((new Date()) + ' Connection accepted.');
//
//     connection.on('message', function(message) {
//         // broadcast message to all connected clients
//         console.log("from" + " " + connection.id );
//         for (var i = 0; i < clients.length; i++) {
//             if (clients[i].id !== connection.id) {
//                 console.log("to" + " " + clients[i].id );
//                 clients[i].send(message.utf8Data);
//             }
//         }
//     });
//     // user disconnected
//     connection.on('close', function() {
//         console.log((new Date()) + " Peer "
//             + connection.remoteAddress + " disconnected.");
//         // remove user from the list of connected clients
//         clients = clients.filter(conn => conn.id !== connection.id);
//     });
// });












