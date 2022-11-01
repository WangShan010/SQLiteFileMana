var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "path", "./access_token.js", "../../../com/configTool.js", "../Util/readFromDB.js", "../Util/readFromNet.js", "../Util/saveToDB.js", "../Util/saveToFile.js", "../Util/initDB.js", "../../../lib/awaitWrap.js", "../../../lib/TileTool/TileUtil4326.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    const axios = require('axios');
    const turf = require('@turf/turf');
    const path_1 = __importDefault(require("path"));
    const access_token_js_1 = __importDefault(require("./access_token.js"));
    const configTool_js_1 = __importDefault(require("../../../com/configTool.js"));
    const readFromDB_js_1 = __importDefault(require("../Util/readFromDB.js"));
    const readFromNet_js_1 = __importDefault(require("../Util/readFromNet.js"));
    const saveToDB_js_1 = __importDefault(require("../Util/saveToDB.js"));
    const saveToFile_js_1 = __importDefault(require("../Util/saveToFile.js"));
    const initDB_js_1 = __importDefault(require("../Util/initDB.js"));
    const awaitWrap_js_1 = __importDefault(require("../../../lib/awaitWrap.js"));
    const TileUtil4326_js_1 = __importDefault(require("../../../lib/TileTool/TileUtil4326.js"));
    let Loading = true;
    let DBName = 'assets.cesium.com';
    let baseUrl = 'https://assets.cesium.com/1/';
    let Authorization = '';
    let CesiumTerrain = {
        async init() {
            if (Loading) {
                Loading = false;
                await configTool_js_1.default.init();
                configTool_js_1.default.preservableONDB() && await (0, initDB_js_1.default)(DBName);
            }
        },
        async getFileBuffer(url) {
            await this.init();
            if (!Authorization) {
                console.log(access_token_js_1.default);
                let [err, data] = await (0, awaitWrap_js_1.default)(axios.get('https://api.cesium.com/v1/assets/1/endpoint?access_token=' + access_token_js_1.default));
                if (data) {
                    data = data.data;
                    Authorization = 'Bearer ' + data.accessToken;
                }
                else {
                    console.log('获取令牌失败');
                }
            }
            let err, buffer, dataSource;
            let headers = { 'Authorization': Authorization };
            let relativePath = '\\1\\' + url;
            let fileSavePath = path_1.default.join(configTool_js_1.default.appBasePath, `temp/fileOut/assets.cesium.com`, relativePath);
            [err, buffer, dataSource] = await (0, readFromDB_js_1.default)({ DBName, relativePath, err, buffer, dataSource });
            [err, buffer, dataSource] = await (0, readFromNet_js_1.default)({ url: baseUrl + url, headers, err, buffer, dataSource });
            if (err?.state === 404) {
            }
            else if (err) {
                console.log('重置 Cesium 地形资源的 令牌');
                Authorization = '';
            }
            dataSource !== 'DB' && configTool_js_1.default.preservableONDB() && (0, saveToDB_js_1.default)({ DBName, relativePath, buffer }, true).then();
            dataSource === 'Net' && configTool_js_1.default.preservableONFile() && (0, saveToFile_js_1.default)(fileSavePath, buffer).then();
            return [err, buffer];
        },
        async getTileListByGeoJson(zoom, geoJson) {
            await this.init();
            let [err, buffer] = await CesiumTerrain.getFileBuffer('layer.json');
            let layerJson = buffer ? JSON.parse(buffer.toString()) : null;
            if (err || layerJson === null) {
                return { tileList: [], boxList: [] };
            }
            let dataRanges = layerJson.available;
            let tileList = [];
            let boxList = [];
            let areaRangeList = dataRanges[zoom];
            for (let i = 0; i < areaRangeList?.length; i++) {
                let areaRange = areaRangeList[i];
                let minTile = TileUtil4326_js_1.default.tileXYZToRectanglePolygon(areaRange.startX, areaRange.startY, zoom);
                let maxTile = TileUtil4326_js_1.default.tileXYZToRectanglePolygon(areaRange.endX, areaRange.endY, zoom);
                let box = turf.bboxPolygon(turf.bbox(turf.featureCollection([minTile, maxTile])));
                boxList.push(box);
                if (!turf.booleanDisjoint(geoJson, box)) {
                    for (let x = areaRange.startX; x <= areaRange.endX; x++) {
                        for (let y = areaRange.startY; y <= areaRange.endY; y++) {
                            tileList.push({ x, y, zoom });
                        }
                    }
                }
            }
            return { tileList, boxList };
        }
    };
    return CesiumTerrain;
});
//# sourceMappingURL=CesiumTerrain.js.map