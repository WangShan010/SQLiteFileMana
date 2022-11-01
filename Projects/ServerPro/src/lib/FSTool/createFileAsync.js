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
    const path = require('path');
    const createDirectory = require('./createDirectory.js');
    async function createFileAsync(filePath, data) {
        let dirPath = path.dirname(filePath) + '\\';
        createDirectory(dirPath);
        if (fs.existsSync(filePath)) {
            return false;
        }
        else {
            return new Promise((resolve, reject) => {
                fs.writeFile(filePath, data, (err) => {
                    if (err) {
                        resolve(false);
                    }
                    else {
                        resolve(true);
                    }
                });
            });
        }
    }
    return createFileAsync;
});
//# sourceMappingURL=createFileAsync.js.map