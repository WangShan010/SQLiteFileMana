// 数据库操作数组
const DBTool = require('./DBTool.js');
const sleep = require('../../lib/sleep.js');

let DBList = [];
let connectTimer = null;
let scanningTimer = null;

// 判断两个时间的分钟差
function getMinuteDiff(startTime, endTime) {
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

    scanningTimer = setInterval(() => {
        DBList = DBList.filter((item) => {
            return item.HasDB !== false;
        });
    }, 1000 * 2);
}

// 根据数据库名称加入数据库连接数组
async function openDB(DBName, autoClose = false) {
    autoClose && openTimer();

    while (1) {
        let DBItem = DBList.find(item => item.DBName === DBName);
        // 如果没有访问过该数据库，则创建一个新的数据库连接任务
        if (!DBItem) {
            let newDBItem = {DBName: DBName, HasDB: 'calculation', dbTool: null, lastTile: new Date()};
            DBList.push(newDBItem);
            console.log('创建新的数据库连接任务', DBName);

            DBTool.HasDB(DBName).then(HasDB => {
                newDBItem.HasDB = HasDB;
                if (HasDB) {
                    newDBItem.dbTool = new DBTool(DBName);
                    newDBItem.dbTool.connect();
                }
            });
            continue;
        }

        DBItem.lastTile = new Date();
        let dbTool = DBItem?.dbTool;

        // 仍在计算中，则等待
        if (DBItem.HasDB === false) {
            return null;
        } else if (DBItem.HasDB === 'calculation') {
            await sleep(100);
            continue;
        } else if (!dbTool || !dbTool?.sqlite3Promise?.db) {
            await sleep(100);
            continue;
        }

        return dbTool;

    }
}

async function closeAll() {
    DBList.forEach((item) => {
        item.dbTool?.close().then();
    });
    DBList = [];
    connectTimer = null;
    scanningTimer = null;
}


const DBConnectTool = {
    openDB,
    closeAll
};


module.exports = DBConnectTool;
