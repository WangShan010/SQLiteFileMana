var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "path", "./access_token.js", "../../../com/configTool.js", "../Util/readFromDB.js", "../Util/readFromNet.js", "../Util/initDB.js", "../Util/saveToDB.js", "../Util/saveToFile.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    const path_1 = __importDefault(require("path"));
    const access_token_js_1 = __importDefault(require("./access_token.js"));
    const configTool_js_1 = __importDefault(require("../../../com/configTool.js"));
    const readFromDB_js_1 = __importDefault(require("../Util/readFromDB.js"));
    const readFromNet_js_1 = __importDefault(require("../Util/readFromNet.js"));
    const initDB_js_1 = __importDefault(require("../Util/initDB.js"));
    const saveToDB_js_1 = __importDefault(require("../Util/saveToDB.js"));
    const saveToFile_js_1 = __importDefault(require("../Util/saveToFile.js"));
    let Loading = true;
    let DBName = 'api.mapbox.com';
    let baseUrl = 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256';
    let MapboxTile = {
        async init() {
            if (Loading) {
                Loading = false;
                await configTool_js_1.default.init();
                configTool_js_1.default.preservableONDB() && await (0, initDB_js_1.default)(DBName);
            }
        },
        async getFileBuffer(z, x, y) {
            await this.init();
            let err, buffer, dataSource;
            if (z > 22) {
                err = { msg: 'Zoom level must be between 0-22.' };
                return [err, buffer, dataSource];
            }
            let url = `${baseUrl}\\${z}\\${x}\\${y}?access_token=` + access_token_js_1.default;
            let relativePath = `\\styles\\v1\\mapbox\\satellite-v9\\tiles\\256\\${z}\\${x}\\${y}.jpeg`;
            let fileSavePath = path_1.default.join(configTool_js_1.default.appBasePath, `temp/fileOut/api.mapbox.com`, relativePath);
            [err, buffer, dataSource] = await (0, readFromDB_js_1.default)({ DBName, relativePath, err, buffer, dataSource });
            [err, buffer, dataSource] = await (0, readFromNet_js_1.default)({ url, headers: {}, err, buffer, dataSource });
            dataSource !== 'DB' && configTool_js_1.default.preservableONDB() && (0, saveToDB_js_1.default)({ DBName, relativePath, buffer }).then();
            dataSource === 'Net' && configTool_js_1.default.preservableONFile() && (0, saveToFile_js_1.default)(fileSavePath, buffer).then();
            return [err, buffer, dataSource];
        }
    };
    return MapboxTile;
});
//# sourceMappingURL=MapboxTile.js.map