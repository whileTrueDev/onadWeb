"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const programIdentifier_1 = require("./programIdentifier");
const hiddenEventHandler_1 = require("./hiddenEventHandler");
const socket = io();
const programType = programIdentifier_1.identifier();
const history = window.history.length;
const THIS_URL = window.location.href;
let bannerName = $('#banner-area').attr('name');
hiddenEventHandler_1.hiddenEventHandler(socket, THIS_URL, programType);
let socketHost = '';
socket.emit('new client', [THIS_URL, history]);
socket.on('host pass', (SOCKET_HOST) => {
    socketHost = SOCKET_HOST;
});
socket.on('browser warning', (DESTINATION_URL) => {
    window.location.href = DESTINATION_URL;
});
socket.on('url warning', () => {
    window.location.href = `${socketHost}/wrongurl`;
});
socket.on('img receive', (msg) => {
    if ($('#imgMessage').find('#banner-area').length === 1) {
        $('#banner-area').fadeOut(1000, () => {
            $('#imgMessage').empty().append(`<img src="${msg[0]}" id="banner-area" name="${msg[1]}" width="100%" height="100%">`);
        }).fadeIn(1000);
    }
    else {
        $('#imgMessage').empty().append(`<img src="${msg[0]}" id="banner-area" name="${msg[1]}" width="100%" height="100%">`);
    }
});
socket.on('response banner data to server', () => {
    bannerName = $('#banner-area').attr('name');
    if (bannerName) {
        const cutBannerName = bannerName.split(',');
        socket.emit('write to db', [cutBannerName, programType]);
    }
});
socket.on('re-render at client', () => {
    bannerName = $('#banner-area').attr('name');
    socket.emit('re-render', [THIS_URL, bannerName]);
});
socket.on('img clear', () => {
    $('#imgMessage').empty();
});
//# sourceMappingURL=client.js.map