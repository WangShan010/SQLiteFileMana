const axios = require('axios');
const turf = require('@turf/turf');
import path from 'path';
import access_token from './access_token.js';
import configTool from '../../../com/configTool.js';
import readFromDB from '../Util/readFromDB.js';
import readFromNet from '../Util/readFromNet.js';
import saveToDB from '../Util/saveToDB.js';
import saveToFile from '../Util/saveToFile.js';
import initDB from '../Util/initDB.js';
import awaitWrap from '../../../lib/awaitWrap.js';
import TileUtil4326 from '../../../lib/TileTool/TileUtil4326.js';

let Loading = true;
let DBName = 'assets.cesium.com';
let baseUrl = 'https://assets.cesium.com/1/';
let Authorization = '';

let CesiumTerrain = {
    async init() {
        if (Loading) {
            Loading = false;
            await configTool.init();
            configTool.preservableONDB() && await initDB(DBName);
        }
    },
    async getFileBuffer(url: string) {
        await this.init();
        if (!Authorization) {
            console.log(access_token);
            let [err, data] = await awaitWrap(axios.get('https://api.cesium.com/v1/assets/1/endpoint?access_token=' + access_token));
            if (data) {
                data = data.data;
                Authorization = 'Bearer ' + data.accessToken;
            } else {
                console.log('获取令牌失败');
            }
        }
        let err, buffer, dataSource;
        let headers = {'Authorization': Authorization};

        let relativePath = '\\1\\' + url;
        let fileSavePath = path.join(configTool.appBasePath, `temp/fileOut/assets.cesium.com`, relativePath);

        // 从数据库中获取文件
        [err, buffer, dataSource] = await readFromDB({DBName, relativePath, err, buffer, dataSource});

        // 从网络获取，并持久化存储
        [err, buffer, dataSource] = await readFromNet({url: baseUrl + url, headers, err, buffer, dataSource});
        if (err?.state === 404) {
        } else if (err) {
            console.log('重置 Cesium 地形资源的 令牌');
            Authorization = '';
        }
        dataSource !== 'DB' && configTool.preservableONDB() && saveToDB({DBName, relativePath, buffer}, true).then();
        dataSource === 'Net' && configTool.preservableONFile() && saveToFile(fileSavePath, buffer).then();

        return [err, buffer];
    },
    async getTileListByGeoJson(zoom: number, geoJson: any) {
        await this.init();
        let [err, buffer] = await CesiumTerrain.getFileBuffer('layer.json');
        let layerJson = buffer ? JSON.parse(buffer.toString()) : null;

        if (err || layerJson === null) {
            return {tileList: [], boxList: []};
        }

        let dataRanges = layerJson.available;

        let tileList = [];
        let boxList = [];
        let areaRangeList = dataRanges[zoom];
        for (let i = 0; i < areaRangeList?.length; i++) {
            let areaRange = areaRangeList[i];
            let minTile = TileUtil4326.tileXYZToRectanglePolygon(areaRange.startX, areaRange.startY, zoom);
            let maxTile = TileUtil4326.tileXYZToRectanglePolygon(areaRange.endX, areaRange.endY, zoom);
            let box = turf.bboxPolygon(turf.bbox(turf.featureCollection([minTile, maxTile])));
            boxList.push(box);
            if (!turf.booleanDisjoint(geoJson, box)) {
                for (let x = areaRange.startX; x <= areaRange.endX; x++) {
                    for (let y = areaRange.startY; y <= areaRange.endY; y++) {
                        tileList.push({x, y, zoom});
                    }
                }
            }
        }

        return {tileList, boxList};
    }
};


export = CesiumTerrain;

