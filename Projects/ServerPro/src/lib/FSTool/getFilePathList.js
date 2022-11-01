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
    const { fdir } = require('fdir');
    async function getFilePathList(parentPath) {
        const api = new fdir().withFullPaths().crawl(parentPath);
        return await api.withPromise();
    }
    return getFilePathList;
});
//# sourceMappingURL=getFilePathList.js.map