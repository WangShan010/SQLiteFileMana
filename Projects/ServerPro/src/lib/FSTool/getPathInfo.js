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
    async function getPathInfo(path, calcMd5 = true) {
        return new Promise(function (resolve) {
            fs.stat(path, (err, stats) => {
                let info = null;
                if (err) {
                }
                else {
                    info = {
                        isDirectory: !!stats && stats.isDirectory(),
                        size: stats.size / 1000,
                        md5: null
                    };
                    if (calcMd5 && !info.isDirectory) {
                        info.md5 = require('crypto').createHash('md5').update(fs.readFileSync(path)).digest('hex');
                    }
                }
                resolve(info);
            });
        });
    }
    return getPathInfo;
});
//# sourceMappingURL=getPathInfo.js.map