const {openDB} = require('../../../com/DBTool/DBConnectTool.js');
const DBTool = require('../../../com/DBTool/DBTool.js');

async function readFromDB({DBName, relativePath, err, buffer, dataSource}: any) {
    if (!buffer) {
        let file;

        if (await DBTool.HasDB(DBName)) {
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

export = readFromDB;
