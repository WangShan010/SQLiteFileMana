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
    function deleteFile(path) {
        let result = true;
        try {
            fs.unlinkSync(path);
        }
        catch (e) {
            result = false;
            console.warn('文件删除失败', path);
        }
        return result;
    }
    return deleteFile;
});
//# sourceMappingURL=deleteFile.js.map