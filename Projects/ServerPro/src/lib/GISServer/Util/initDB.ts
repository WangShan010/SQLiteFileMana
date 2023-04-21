const DBTool = require('../../../com/DBTool/DBTool.js');

async function initDB(DBName: string) {
    if (!await DBTool.HasDB(DBName)) {
        let dbTool = new DBTool(DBName);
        await dbTool.connect();
        await dbTool.close();
    }
}

export = initDB;
