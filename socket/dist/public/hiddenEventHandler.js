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
//# sourceMappingURL=hiddenEventHandler.js.map