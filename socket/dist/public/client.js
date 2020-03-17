"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const programIdentifier_1 = require("./programIdentifier");
const hiddenEventHandler_1 = require("./hiddenEventHandler");
const socket = io();
const programType = programIdentifier_1.identifier();
const history = window.history.length;
const THIS_URL = window.location.href;
const bannerName = $('#banner-area').attr('name');
hiddenEventHandler_1.hiddenEventHandler(socket);
socket.emit('new client', [THIS_URL, history]);
socket.on('browser warning', (destination) => {
    window.location.href = destination;
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
    if (bannerName) {
        const cutBannerName = bannerName.split(',');
        socket.emit('write to db', [cutBannerName, programType]);
    }
});
socket.on('re-render at client', () => {
    socket.emit('re-render', [THIS_URL, bannerName]);
});
socket.on('img clear', () => {
    $('#imgMessage').empty();
});
//# sourceMappingURL=client.js.map