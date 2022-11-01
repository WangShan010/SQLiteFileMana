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
    function chunk(arr, size) {
        let result = [];
        for (let i = 0, len = arr.length; i < len; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }
    return chunk;
});
//# sourceMappingURL=arrChunk.js.map