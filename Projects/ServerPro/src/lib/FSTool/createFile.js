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
    function createFile(filePath, data) {
        let dirPath = path.dirname(filePath) + '\\';
        createDirectory(dirPath);
        if (fs.existsSync(filePath)) {
        }
        else {
            fs.writeFileSync(filePath, data);
        }
    }
    return createFile;
});
//# sourceMappingURL=createFile.js.map