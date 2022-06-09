const access_token = require('./access_token.js');
const configTool = require('../../../com/configTool');
const path = require('path');

const readFromDB = require('../Util/readFromDB');
const readFromNet = require('../Util/readFromNet');
const initDB = require('../Util/initDB');
const saveOnDB = require('../Util/saveOnDB');
const saveOnFile = require('../Util/saveOnFile');


let Loading = true;
let DBName = 'api.mapbox.com';
let baseUrl = 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256';

let MapboxTile = {
    async init() {
        if (Loading) {
            Loading = false;
            await configTool.init();
            configTool.config.CacheSaveDB && await initDB(DBName);
        }
    },
    async getFileBuffer(z, x, y) {
        await this.init();
        let [err, buffer, dataSource] = [];
        if (z > 22) {
            err = {msg: 'Zoom level must be between 0-22.'};
            return  [err, buffer, dataSource];
        }

        let url = `${baseUrl}\\${z}\\${x}\\${y}?access_token=` + access_token;
        let relativePath = `\\styles\\v1\\mapbox\\satellite-v9\\tiles\\256\\${z}\\${x}\\${y}.jpeg`;
        let fileSavePath = path.join(configTool.appBasePath, `temp/fileOut/api.mapbox.com`, relativePath);

        // 从数据库中获取文件
        [err, buffer, dataSource] = await readFromDB({DBName, relativePath, err, buffer, dataSource});

        // 从网络获取，并持久化存储
        [err, buffer, dataSource] = await readFromNet({url, headers: {}, err, buffer, dataSource});

        dataSource !== 'DB' && saveOnDB({DBName, relativePath, buffer}).then();
        dataSource === 'Net' && saveOnFile({fileSavePath, buffer}).then();

        return [err, buffer, dataSource];
    }
};

module.exports = MapboxTile;
