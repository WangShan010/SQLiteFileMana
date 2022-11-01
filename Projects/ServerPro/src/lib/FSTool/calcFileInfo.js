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
    const compressible = require('./compressible.js');
    const zlibPromise = require('./zlibPromise.js');
    async function readFile(path) {
        return new Promise(function (resolve) {
            fs.readFile(path, function (error, date) {
                if (error) {
                    resolve(Buffer.from(''));
                }
                else {
                    resolve(date);
                }
            });
        });
    }
    async function calcFileInfo(fullPath, rootPath = '', compress = true) {
        let relativePath = fullPath.replace(rootPath, '');
        let fileName = fullPath.split('\\').slice(-1)[0];
        let buffer = await readFile(fullPath);
        let compressType = '';
        if (compress && compressible(fullPath)) {
            buffer = await zlibPromise.zip(buffer);
            compressType = 'gzip';
        }
        let md5 = require('crypto').createHash('md5').update(buffer).digest('hex');
        let size = buffer.length;
        return {
            fullPath,
            relativePath,
            fileName,
            buffer,
            compressType,
            md5,
            size
        };
    }
    return calcFileInfo;
});
//# sourceMappingURL=calcFileInfo.js.map