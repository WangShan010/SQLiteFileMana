const access_token = require('./access_token.js');
const configTool = require('../../../com/configTool');
const path = require('path');
const axios = require('axios');

const readFromDB = require('../Util/readFromDB');
const readFromNet = require('../Util/readFromNet');
const saveOnDB = require('../Util/saveOnDB');
const saveOnFile = require('../Util/saveOnFile');
const initDB = require('../Util/initDB');
const awaitWrap = require('../../../lib/awaitWrap.js');

let Loading = true;
let DBName = 'assets.cesium.com';
let baseUrl = 'https://assets.cesium.com/1/';
let Authorization = '';

let CesiumTerrain = {
    async init() {
        if (Loading) {
            Loading = false;
            await configTool.init();
            configTool.config.CacheSaveDB && await initDB(DBName);
        }
    },
    async getFileBuffer(url) {
        await this.init();
        if (!Authorization) {
            let [err, data] = await awaitWrap(axios.get('https://api.cesium.com/v1/assets/1/endpoint?access_token=' + access_token));
            if (data) {
                data = data.data;
                Authorization = 'Bearer ' + data.accessToken;
            } else {
                console.log('获取令牌失败');
            }
        }
        let [err, buffer, dataSource] = [];
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
        dataSource !== 'DB' && saveOnDB({DBName, relativePath, buffer}, true).then();
        dataSource === 'Net' && saveOnFile({fileSavePath, buffer}).then();

        return [err, buffer];
    }
};


module.exports = CesiumTerrain;

