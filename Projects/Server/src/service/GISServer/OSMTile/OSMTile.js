const path = require('path');
const configTool = require('../../../com/configTool.js');

const saveOnDB = require('../Util/saveOnDB.js');
const saveOnFile = require('../Util/saveOnFile.js');
const readFromDB = require('../Util/readFromDB.js');
const readFromNet = require('../Util/readFromNet.js');
const initDB = require('../Util/initDB');


let Loading = true;
let DBName = 'tile.openstreetmap.org';
let baseUrlList = ['https://tile.openstreetmap.org', 'https://a.tile.openstreetmap.org', 'https://b.tile.openstreetmap.org', 'https://c.tile.openstreetmap.org'];
let headers = ['Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36', 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/532.5 (KHTML, like Gecko) Chrome/4.0.249.0 Safari/532.5', 'Mozilla/5.0 (Windows; U; Windows NT 5.2; en-US) AppleWebKit/532.9 (KHTML, like Gecko) Chrome/5.0.310.0 Safari/532.9', 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/534.7 (KHTML, like Gecko) Chrome/7.0.514.0 Safari/534.7', 'Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US) AppleWebKit/534.14 (KHTML, like Gecko) Chrome/9.0.601.0 Safari/534.14', 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.14 (KHTML, like Gecko) Chrome/10.0.601.0 Safari/534.14', 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.20 (KHTML, like Gecko) Chrome/11.0.672.2 Safari/534.20", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534.27 (KHTML, like Gecko) Chrome/12.0.712.0 Safari/534.27', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/13.0.782.24 Safari/535.1'];


let OSMTile = {
    async init() {
        if (Loading) {
            Loading = false;
            await configTool.init();
            configTool.config.CacheSaveDB && await initDB(DBName);
        }
    },
    async getFileBuffer(z, x, y) {
        await this.init();

        let header = headers[Math.floor(Math.random() * headers.length)];
        let relativePath = `\\${z}\\${x}\\${y}.png`;
        let url = baseUrlList[Math.floor(Math.random() * baseUrlList.length)] + `\\${z}\\${x}\\${y}.png`;
        let fileSavePath = path.join(configTool.appBasePath, `temp/fileOut/tile.openstreetmap.org`, relativePath);

        let [err, buffer, dataSource] = [];
        // 从数据库中获取文件
        [err, buffer, dataSource] = await readFromDB({DBName, relativePath, err, buffer, dataSource});

        // 从网络获取，并持久化存储
        [err, buffer, dataSource] = await readFromNet({url, headers: {'User-Agent': header}, err, buffer, dataSource});

        dataSource !== 'DB' && saveOnDB({DBName, relativePath, buffer}).then();
        dataSource === 'Net' && saveOnFile({fileSavePath, buffer}).then();

        return [err, buffer, dataSource];
    }
};


module.exports = OSMTile;
