'use strict';

const URL_SOCKET = 'wss://fep-app.herokuapp.com/';
let socket = null;

export function chatConnection(config){
    socket = new WebSocket(URL_SOCKET);

    socket.onopen = (msg) => {
        console.log('socket connected');
        config.onSend(msg);
    };

    socket.onmessage = (msg) => {
        config.onMessage && config.onMessage(JSON.parse(msg.data));
    };

    socket.onclose = () => {
        config.onClose();
        // chatConnection(config);
        console.log('closed');
    };

    socket.onerror = (err) => {
        console.log('error message', err);
    };
}

export function send(msg) {
    socket.send(JSON.stringify(msg));
}

export function getSocketMessage(config){
    socket.onmessage = (msg) => {
        config.onUpdateData(JSON.parse(msg.data));
    };
}