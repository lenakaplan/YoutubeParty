"use strict";

var videoId = "";
var recentRecievedMessage = 0;

window.WebSocket = window.WebSocket || window.MozWebSocket;
if (!window.WebSocket) {
    content.html($('<p>',
        { text:'Sorry, but your browser doesn\'t support WebSocket.'}
    ));
    input.hide();
    $('span').hide();
}

var HOST = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(HOST);
ws.onerror = function (error) {
    content.html($('<p>', {
        text: 'Sorry, but there\'s some problem with your '
            + 'connection or the server is down.'
    }));
};

ws.onmessage = function (message) {
    recentRecievedMessage = Date.now();
    try {
        var json = JSON.parse(message.data);
        if (json.event === 'play'){
            player.seekTo(json.time, true);
            player.playVideo();
        }
        else if (json.event === 'pause'){
            player.pauseVideo()
        }
    } catch (e) {
        console.log('Invalid JSON: ', message.data);
    }
};

function broadcast(msg){
    if (!msg) {
        return;
    }
    ws.send(msg);
}

var player;
var urlParams = new URLSearchParams(window.location.search);
videoId = urlParams.get('v');

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: videoId,
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    if (Date.now() - recentRecievedMessage < 1000){
        return;
    }
    if (event.data === YT.PlayerState.PLAYING) {
        var obj = {
            time: player.getCurrentTime(),
            event: "play"
        };
        broadcast(JSON.stringify(obj));
    }
    else if (event.data === YT.PlayerState.PAUSED){
        var obj = {
            event: "pause"
        };
        broadcast(JSON.stringify(obj));
    }
}

function stopVideo() {
    player.stopVideo();
}