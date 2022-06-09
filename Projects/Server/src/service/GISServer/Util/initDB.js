const DBTool = require('../../../com/DBTool/DBTool');

async function initDB(DBName) {
    if (!await DBTool.HasDB(DBName)) {
        let dbTool = new DBTool(DBName);
        await dbTool.connect();
        await dbTool.close();
    }
}

module.exports = initDB;