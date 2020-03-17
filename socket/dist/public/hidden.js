"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hidden() {
    let hidden;
    let visibilityChange;
    if (typeof document.hidden !== 'undefined') {
        hidden = 'hidden';
        visibilityChange = 'visibilitychange';
        return { hidden: 'hidden', visibilityChange };
    }
}
exports.hidden = hidden;
//# sourceMappingURL=hidden.js.map