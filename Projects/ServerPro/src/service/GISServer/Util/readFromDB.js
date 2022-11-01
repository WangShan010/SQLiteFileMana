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
    const { openDB } = require('../../../com/DBTool/DBConnectTool.js');
    const DBTool = require('../../../com/DBTool/DBTool.js');
    async function readFromDB({ DBName, relativePath, err, buffer, dataSource }) {
        if (!buffer) {
            let file;
            if (await DBTool.HasDB(DBName)) {
                let dbTool = await openDB(DBName);
                file = await dbTool.getFileByFullPath(relativePath);
            }
            if (file) {
                err = null;
                buffer = file.file_data;
                dataSource = 'DB';
            }
        }
        return [err, buffer, dataSource];
    }
    return readFromDB;
});
//# sourceMappingURL=readFromDB.js.map