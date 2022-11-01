// 数据库操作数组
const DBTool = require('./DBTool.js');
const sleep = require('../../lib/sleep.js');

let DBList: any[] = [];
let connectTimer: NodeJS.Timeout;
let scanningTimer: NodeJS.Timeout;

// 判断两个时间的分钟差
function getMinuteDiff(startTime: string, endTime: string) {
    let start = new Date(startTime.replace(/-/g, '/'));
    let end = new Date(endTime.replace(/-/g, '/'));
    let diff = end.getTime() - start.getTime();
    return diff / (1000 * 60);
}

// 开启计时器，每五分钟关闭数据连接
function openTimer() {
    if (connectTimer && scanningTimer) return;
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

// 根据数据库名称加入数据库连接数组
async function openDB(DBName: string, autoClose = false) {
    autoClose && openTimer();

    while (1) {
        let DBItem = DBList.find(item => item.DBName === DBName);
        // 如果没有访问过该数据库，则创建一个新的数据库连接任务
        if (!DBItem) {
            let newDBItem = {DBName: DBName, dbTool: null, lastTile: new Date()};
            DBList.push(newDBItem);

            let HasDB = await DBTool.HasDB(DBName);
            let dbTool = new DBTool(DBName);
            newDBItem.dbTool = dbTool;
            if (dbTool) {
                await dbTool.connect();
            }

            if (HasDB) {
                console.log(`数据库【${DBName}】存在，连接成功`);
            } else {
                console.log(`数据库【${DBName}】不存在，创建成功`);
            }


            continue;
        }

        DBItem.lastTile = new Date();
        let dbTool = DBItem?.dbTool;

        // 仍在计算中，则等待
        if (!dbTool || !dbTool?.sqlite3Promise?.db) {
            await sleep(100);
            continue;
        }

        return dbTool;
    }
}

// 重新连接数据库
async function reConnect(DBName: string) {
    let DBItem = DBList.find(item => item.DBName === DBName);
    if (DBItem) {
        let dbTool = DBItem?.dbTool;
        if (dbTool) await dbTool.close();
        DBItem.dbTool = new DBTool(DBName);
        await DBItem.dbTool.connect();
        return DBItem.dbTool;
    } else {
        return await openDB(DBName);
    }
}


async function closeAll() {
    for (let i = 0; i < DBList.length; i++) {
        let dbTool = DBList[i].dbTool;
        if (dbTool) await dbTool.close();
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


export = DBConnectTool;
