var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../../lib/FSTool/zlibPromise.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    const path = require('path');
    const { openDB } = require('../../../com/DBTool/DBConnectTool.js');
    const zlibPromise_js_1 = __importDefault(require("../../../lib/FSTool/zlibPromise.js"));
    async function saveToDB({ DBName, relativePath, buffer }, needCompress = false) {
        if (DBName && relativePath && buffer) {
            let dbTool = await openDB(DBName);
            buffer = needCompress ? await zlibPromise_js_1.default.zip(buffer) : buffer;
            await dbTool.insertData([{
                    relativePath: relativePath,
                    fileName: path.basename(relativePath),
                    buffer: buffer,
                    compressType: needCompress ? 'gzip' : '',
                    md5: require('crypto').createHash('md5').update(buffer).digest('hex'),
                    size: buffer.length
                }], null, 'large', false);
        }
    }
    return saveToDB;
});
//# sourceMappingURL=saveToDB.js.map