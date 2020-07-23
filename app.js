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

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });

    ws.isAlive = true;
    ws.on('pong', heartbeat);
});

const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();

        ws.isAlive = false;
        ws.ping(noop);
    });
}, 30000);

wss.on('close', function close() {
    clearInterval(interval);
});



