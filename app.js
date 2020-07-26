"use strict";
process.title = 'youtube-party';
const PORT = process.env.PORT || 3000;

var WebSocket = require('ws');
var express = require('express');

const server = express()
    .use(express.static('client'))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

function noop() {}

function heartbeat() {
    this.isAlive = true;
}
const wss = new WebSocket.Server({server:server});
const roomClients = {};
const roomVideo = {};
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        var message = JSON.parse(data);

        if (message.join) {
            if (!roomClients[message.join]) {
                roomClients[message.join] = [];
            }
            roomClients[message.join].push(ws);

            if (message.videoId) {
                if (!roomVideo[message.join]) {
                    roomVideo[message.join] = [];
                }
                roomVideo[message.join] = message.videoId;
                message.event = 'join';
                broadcastToAll(message)
            }
            else{
                message.event = 'join';
                message.videoId = roomVideo[message.join];
                broadcastToAll(message)
            }
        }
        if(message.room){
            broadcast(ws, message);
        }
    });

    ws.isAlive = true;
    ws.on('pong', heartbeat);

});

function broadcast(ws, message) {
    roomClients[message.room || message.join].forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

function broadcastToAll(message) {
    roomClients[message.room || message.join].forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) {
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping(noop);
    });
}, 30000);

wss.on('close', function close() {
    clearInterval(interval);
});



