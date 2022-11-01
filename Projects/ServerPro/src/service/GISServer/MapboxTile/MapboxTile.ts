import path from 'path';
import access_token from './access_token.js';
import configTool from '../../../com/configTool.js';
import readFromDB from '../Util/readFromDB.js';
import readFromNet from '../Util/readFromNet.js';
import initDB from '../Util/initDB.js';
import saveToDB from '../Util/saveToDB.js';
import saveToFile from '../Util/saveToFile.js';


let Loading = true;
let DBName = 'api.mapbox.com';
let baseUrl = 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256';

let MapboxTile = {
    async init() {
        if (Loading) {
            Loading = false;
            await configTool.init();
            configTool.preservableONDB() && await initDB(DBName);
        }
    },
    async getFileBuffer(z: number, x: number, y: number) {
        await this.init();
        let err, buffer, dataSource;
        if (z > 22) {
            err = {msg: 'Zoom level must be between 0-22.'};
            return [err, buffer, dataSource];
        }

        let url = `${baseUrl}\\${z}\\${x}\\${y}?access_token=` + access_token;
        let relativePath = `\\styles\\v1\\mapbox\\satellite-v9\\tiles\\256\\${z}\\${x}\\${y}.jpeg`;
        let fileSavePath = path.join(configTool.appBasePath, `temp/fileOut/api.mapbox.com`, relativePath);

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
