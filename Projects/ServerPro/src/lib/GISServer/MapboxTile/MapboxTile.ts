import path from 'path';
import access_token from './access_token.js';
import configTool from '../../../com/configTool.js';
import readFromDB from '../Util/readFromDB.js';
import readFromNet from '../Util/readFromNet.js';
import initDB from '../Util/initDB.js';
import saveToDB from '../Util/saveToDB.js';
import saveToFile from '../Util/saveToFile.js';
import readFromDisk from '../Util/readFromDisk.js';


let Loading = true;
const DBName = 'api.mapbox.com';
const satelliteUrl = 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256';
const terrainVectorUrl = 'https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2';
const terrainRGBUrl = 'https://api.mapbox.com/v4/mapbox.terrain-rgb';

let MapboxTile = {
    async init() {
        if (Loading) {
            Loading = false;
            await configTool.init();
            configTool.preservableONDB() && await initDB(DBName);
        }
    },
    // 获取影像瓦片
    async getSatelliteFileBuffer(z: number, x: number, y: number) {
        await this.init();
        let err, buffer, dataSource;
        if (z > 22) {
            err = {msg: 'Zoom level must be between 0-22.'};
            return [err, buffer, dataSource];
        }

        let url = `${satelliteUrl}\\${z}\\${x}\\${y}?access_token=` + access_token;
        let relativePath = `\\styles\\v1\\mapbox\\satellite-v9\\tiles\\256\\${z}\\${x}\\${y}.jpeg`;
        let fileSavePath = path.join(configTool.appBasePath, `temp/fileOut/api.mapbox.com`, relativePath);

        // 从本地文件夹中获取文件
        [err, buffer, dataSource] = await readFromDisk({fileSavePath, err, buffer, dataSource});

        // 从数据库中获取文件
        [err, buffer, dataSource] = await readFromDB({DBName, relativePath, err, buffer, dataSource});

        // 从网络获取，并持久化存储
        [err, buffer, dataSource] = await readFromNet({url, headers: {}, err, buffer, dataSource});

        dataSource !== 'DB' && configTool.preservableONDB() && saveToDB({DBName, relativePath, buffer}).then();
        dataSource === 'Net' && configTool.preservableONFile() && saveToFile(fileSavePath, buffer).then();

        return [err, buffer, dataSource];
    },
    // 获取地形颜色瓦片
    async getTerrainRGBFileBuffer(z: number, x: number, y: number) {
        await this.init();
        let err, buffer, dataSource;
        if (z > 22) {
            err = {msg: 'Zoom level must be between 0-22.'};
            return [err, buffer, dataSource];
        }

        let url = `${terrainRGBUrl}\\${z}\\${x}\\${y}@2x.pngraw?access_token=` + access_token;
        let relativePath = `\\v4\\mapbox.terrain-rgb\\${z}\\${x}\\${y}.png`;
        let fileSavePath = path.join(configTool.appBasePath, `temp/fileOut/api.mapbox.com`, relativePath);

        // 从本地文件夹中获取文件
        [err, buffer, dataSource] = await readFromDisk({fileSavePath, err, buffer, dataSource});

        // 从数据库中获取文件
        [err, buffer, dataSource] = await readFromDB({DBName, relativePath, err, buffer, dataSource});

        // 从网络获取，并持久化存储
        [err, buffer, dataSource] = await readFromNet({url, headers: {}, err, buffer, dataSource});


        dataSource !== 'DB' && configTool.preservableONDB() && saveToDB({DBName, relativePath, buffer}).then();
        dataSource === 'Net' && configTool.preservableONFile() && saveToFile(fileSavePath, buffer).then();

        return [err, buffer, dataSource];
    }
};

export = MapboxTile;
