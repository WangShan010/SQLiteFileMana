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
    const fsPromises = require('fs-promise');
    const path = require('path');
    const fs = require('fs');
    async function saveToFile(fileSavePath, buffer) {
        if (fileSavePath && buffer) {
            await fsPromises.ensureDir(path.dirname(fileSavePath));
            fs.writeFileSync(fileSavePath, buffer);
        }
    }
    return saveToFile;
});
//# sourceMappingURL=saveToFile.js.map