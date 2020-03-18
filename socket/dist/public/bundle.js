(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./hiddenEventHandler":2,"./programIdentifier":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hiddenEventHandler(socket, THIS_URL, programType) {
    const cutUrl = `/${THIS_URL.split('/')[4]}`;
    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === 'hidden') {
            socket.emit('pageActive handler', [cutUrl, 0, programType]);
            $('#imgMessage').empty();
        }
        else {
            socket.emit('pageActive handler', [cutUrl, 1, programType]);
            socket.emit('pageOn', THIS_URL);
        }
    });
}
exports.hiddenEventHandler = hiddenEventHandler;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function identifier() {
    const navi = navigator.userAgent.toLowerCase();
    let program;
    if (navi.indexOf('xsplit') !== -1) {
        program = 'xsplit';
        return program;
    }
    else if (navi.indexOf('twitch') !== -1) {
        program = 'twitch-studio';
        return program;
    }
    else {
        program = 'obs';
        return program;
    }
}
exports.identifier = identifier;

},{}]},{},[2,1,3]);
