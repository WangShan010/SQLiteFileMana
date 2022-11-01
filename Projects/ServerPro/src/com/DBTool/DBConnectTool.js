(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    const DBTool = require('./DBTool.js');
    const sleep = require('../../lib/sleep.js');
    let DBList = [];
    let connectTimer;
    let scanningTimer;
    function getMinuteDiff(startTime, endTime) {
        let start = new Date(startTime.replace(/-/g, '/'));
        let end = new Date(endTime.replace(/-/g, '/'));
        let diff = end.getTime() - start.getTime();
        return diff / (1000 * 60);
    }
    function openTimer() {
        if (connectTimer && scanningTimer)
            return;
        clearInterval(connectTimer);
        clearInterval(scanningTimer);
        connectTimer = setInterval(() => {
            DBList.forEach((item) => {
                let now = new Date();
                let diff = getMinuteDiff(DBList[0].lastTile.toString(), now.toString());
                if (diff > 5) {
                    item.dbTool.close().then();
                    DBList[0].lastTile = now;
                }
            });
        }, 1000 * 60);
    }
    async function openDB(DBName, autoClose = false) {
        autoClose && openTimer();
        while (1) {
            let DBItem = DBList.find(item => item.DBName === DBName);
            if (!DBItem) {
                let newDBItem = { DBName: DBName, dbTool: null, lastTile: new Date() };
                DBList.push(newDBItem);
                let HasDB = await DBTool.HasDB(DBName);
                let dbTool = new DBTool(DBName);
                newDBItem.dbTool = dbTool;
                if (dbTool) {
                    await dbTool.connect();
                }
                if (HasDB) {
                    console.log(`数据库【${DBName}】存在，连接成功`);
                }
                else {
                    console.log(`数据库【${DBName}】不存在，创建成功`);
                }
                continue;
            }
            DBItem.lastTile = new Date();
            let dbTool = DBItem?.dbTool;
            if (!dbTool || !dbTool?.sqlite3Promise?.db) {
                await sleep(100);
                continue;
            }
            return dbTool;
        }
    }
    async function reConnect(DBName) {
        let DBItem = DBList.find(item => item.DBName === DBName);
        if (DBItem) {
            let dbTool = DBItem?.dbTool;
            if (dbTool)
                await dbTool.close();
            DBItem.dbTool = new DBTool(DBName);
            await DBItem.dbTool.connect();
            return DBItem.dbTool;
        }
        else {
            return await openDB(DBName);
        }
    }
    async function closeAll() {
        for (let i = 0; i < DBList.length; i++) {
            let dbTool = DBList[i].dbTool;
            if (dbTool)
                await dbTool.close();
        }
        DBList = [];
        clearTimeout(connectTimer);
        clearTimeout(scanningTimer);
    }
    const DBConnectTool = {
        openDB,
        reConnect,
        closeAll
    };
    return DBConnectTool;
});
//# sourceMappingURL=DBConnectTool.js.map