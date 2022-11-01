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
    const fs = require('fs');
    function createDirectory(path) {
        const dirCache = {};
        const arr = path.replace(/\\/g, '/').split('/');
        let dir = arr[0];
        for (let i = 1; i < arr.length; i++) {
            if (!dirCache[dir] && !fs.existsSync(dir)) {
                dirCache[dir] = true;
                fs.mkdirSync(dir);
            }
            dir = dir + '/' + arr[i];
        }
    }
    return createDirectory;
});
//# sourceMappingURL=createDirectory.js.map