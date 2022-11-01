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
    const DBTool = require('../../../com/DBTool/DBTool.js');
    async function initDB(DBName) {
        if (!await DBTool.HasDB(DBName)) {
            let dbTool = new DBTool(DBName);
            await dbTool.connect();
            await dbTool.close();
        }
    }
    return initDB;
});
//# sourceMappingURL=initDB.js.map