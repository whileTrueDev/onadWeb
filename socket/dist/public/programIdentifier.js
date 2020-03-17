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
//# sourceMappingURL=programIdentifier.js.map