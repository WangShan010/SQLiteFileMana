const configTool = require('../../../com/configTool');
const {openDB} = require('../../../com/DBTool/DBConnectTool');
const DBTool = require('../../../com/DBTool/DBTool.js');

async function readFromDB({DBName, relativePath, err, buffer, dataSource}) {
    if (!buffer && configTool.config.CacheSaveDB) {
        let file;
        if (!await DBTool.HasDB(DBName)) {
            let dbTool = new DBTool(DBName);
            await dbTool.connect();
            file = await dbTool.getFileByFullPath(relativePath);
            await dbTool.close();
        } else {
            let dbTool = await openDB(DBName);
            file = await dbTool.getFileByFullPath(relativePath);
        }

        if (file) {
            err = null;
            buffer = file.file_data;
            dataSource = 'DB';
        }
    }

    return [err, buffer, dataSource];
}

module.exports = readFromDB;
