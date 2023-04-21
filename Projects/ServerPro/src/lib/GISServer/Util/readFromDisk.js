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
    const readFileAsync = require('../../FSTool/readFileAsync.js');
    async function readFromDisk({ fileSavePath, err, buffer, dataSource }) {
        if (!buffer) {
            [err, buffer] = await readFileAsync(fileSavePath);
            dataSource = 'Disk';
        }
        return [err, buffer, dataSource];
    }
    return readFromDisk;
});
//# sourceMappingURL=readFromDisk.js.map