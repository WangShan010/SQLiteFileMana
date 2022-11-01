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
    async function stringMd5(str) {
        return require('crypto').createHash('md5').update(Buffer.from(str)).digest('hex');
    }
    return stringMd5;
});
//# sourceMappingURL=stringMd5.js.map