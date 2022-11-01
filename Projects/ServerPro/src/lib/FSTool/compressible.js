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
    function compressible(filePath) {
        let ext = path.extname(filePath).toLowerCase();
        let boolean = true;
        let fileExtList = [
            '.png',
            '.jpg',
            '.jpeg',
            '.zip',
            '.rar',
            '.mp3',
            '.mp4',
            '.avi',
            '.gif'
        ];
        fileExtList.forEach(e => e === ext && (boolean = false));
        return boolean;
    }
    return compressible;
});
//# sourceMappingURL=compressible.js.map