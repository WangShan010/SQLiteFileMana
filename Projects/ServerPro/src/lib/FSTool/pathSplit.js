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
    const path = require('path');
    function pathSplit(filePath) {
        let pathList = [];
        let pathSplit = filePath.replaceAll('/', '\\').split('');
        for (let i = 0; i < pathSplit.length; i++) {
            if (pathSplit[i] === '\\' || i === pathSplit.length) {
                pathList.push(pathSplit.slice(0, i + 1).join(''));
            }
        }
        return pathList;
    }
    return pathSplit;
});
//# sourceMappingURL=pathSplit.js.map