// $(function () {
"use strict";
// for better performance - to avoid searching in DOM
var videoId = "";
var lastSentMessage = null;
// if user is running mozilla then use it's built-in WebSocket
window.WebSocket = window.WebSocket || window.MozWebSocket;
// if browser doesn't support WebSocket, just show
// some notification and exit
if (!window.WebSocket) {
    content.html($('<p>',
        { text:'Sorry, but your browser doesn\'t support WebSocket.'}
    ));
    input.hide();
    $('span').hide();
    // return;
}
// open connection
// var connection = new WebSocket('ws://127.0.0.1');

var HOST = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(HOST);
ws.onopen = function () {
};
ws.onerror = function (error) {
    // just in there were some problems with connection...
    content.html($('<p>', {
        text: 'Sorry, but there\'s some problem with your '
            + 'connection or the server is down.'
    }));
};
// most important part - incoming messages
ws.onmessage = function (message) {
    // try to parse JSON message. Because we know that the server
    // always returns JSON this should work without any problem but
    // we should make sure that the massage is not chunked or
    // otherwise damaged.
    if (Date.now() - lastSentMessage < 500){
        return;
    }
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
/**
 * Send message when user presses Enter key
 */
function broadcast(msg){
    if (!msg) {
        return;
    }
    // send the message as an ordinary text
    ws.send(msg);
}
// });