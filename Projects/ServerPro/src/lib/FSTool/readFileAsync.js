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
    function readFileAsync(filePath, encoding) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, encoding, (err, data) => {
                if (err) {
                    resolve([err, null]);
                }
                else {
                    resolve([null, data]);
                }
            });
        });
    }
    return readFileAsync;
});
//# sourceMappingURL=readFileAsync.js.map