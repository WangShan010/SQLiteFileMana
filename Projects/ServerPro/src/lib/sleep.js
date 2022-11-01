(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    function sleep(ms = 100) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    return sleep;
});
//# sourceMappingURL=sleep.js.map