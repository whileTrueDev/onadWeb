"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hiddenEventHandler(socket) {
    const visibilityChange = 'visibilityChange';
    const hidden = 'hidden';
    function handleVisibilityChange() {
        if (document[hidden]) {
            console.log('hidden');
            socket.emit('hiddenTest', 'hidden');
        }
        else {
            console.log('show');
            socket.emit('showTest', 'show');
        }
    }
    if (typeof document.addEventListener === 'undefined' || typeof document.hidden === 'undefined') {
        alert('지원하지 않는 브라우저입니다. 크롬에서 시도해주세요.');
    }
    else {
        document.addEventListener(visibilityChange, handleVisibilityChange, false);
    }
}
exports.hiddenEventHandler = hiddenEventHandler;
//# sourceMappingURL=hiddenEventHandler.js.map