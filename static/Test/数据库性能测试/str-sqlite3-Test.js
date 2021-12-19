const Database = require("better-sqlite3");
let sqlite3 = require("sqlite3").verbose();
const sqlite3Promise = require("../../../src/mainRenderer/components/DBMana/DBTool/sqlite3-promise.js");
const ProgressBar = require("../../../src/mainRenderer/components/Utils/ProgressBar/ProgressBar.js");

let SQL_CREATETable = "CREATE TABLE IF NOT EXISTS file_info (file_gid INTEGER PRIMARY KEY,file_name TEXT, file_full_path TEXT ,file_size INTEGER ,file_zip TEXT ,file_md5 TEXT)";
let SQL_INSERT = "INSERT INTO file_info (file_name,file_full_path,file_size) VALUES (?,?,?)";
let SQL_SELECT = "SELECT COUNT(file_gid) FROM file_info";

let pb = new ProgressBar("数据库写入测试", 50);

// 常规 node-sqlite3 ，一万/17.6秒， 574并发 / 秒
async function main01() {
    console.time("运行main01");
    let db = new sqlite3.Database(__dirname + "/db.sqlite");
    db.serialize(function () {
        db.run(SQL_CREATETable);
        let stmt = db.prepare(SQL_INSERT);

        for (let i = 0; i < 1000; i++) {
            stmt.run("压缩包.zip", "H:\\gitee\\GISFileMana\\node_modules\\@szmarczak\\http-timer\\source" + i, 32);
        }

        stmt.finalize();

        db.all("SELECT COUNT(file_gid) FROM file_info", function (err, data) {
            console.log(data[0]);
            console.timeEnd("运行main01");
        });
    });
    db.close();
}

// 常规 better-sqlite3 ，一万/17.1秒， 580并发 / 秒
async function main02() {
    console.time("运行main02");
    const db = new Database("foobar.db", {});

    db.prepare("CREATE TABLE IF NOT EXISTS file_info (file_gid INTEGER PRIMARY KEY,file_name TEXT, file_full_path TEXT,file_size INTEGER,file_zip TEXT,file_md5 TEXT)").run();

    const stmtINSERT = db.prepare("INSERT INTO file_info (file_name,file_full_path,file_size) VALUES (?,?,?)");

    for (let i = 0; i < 10000; i++) {
        stmtINSERT.run("压缩包.zip", "H:\\gitee\\GISFileMana\\node_modules\\@szmarczak\\http-timer\\source" + i, 32);
    }

    let list = db.prepare("SELECT COUNT(file_gid) FROM file_info").all();
    console.log(list[0]);

    console.timeEnd("运行main02");
}

// 开启事务 node-sqlite3 ，十万/5.9秒， 1万七千并发 / 秒
async function main03() {
    console.time("运行main03");

    await sqlite3Promise.open(__dirname + "/db.sqlite");

    await sqlite3Promise.run(SQL_CREATETable);

    await sqlite3Promise.beginTransaction();   // 未开启事务前 200秒，开启后 0.98秒

    // 不为回滚日志考虑，同步锁我们可以关闭或者降低安全等级
    // await sqlite3Promise.run('PRAGMA synchronous = FULL;');   // 默认  1万/103秒
    // await sqlite3Promise.run('PRAGMA synchronous = NORMAL;');    // 50倍+  1万/72秒
    // await sqlite3Promise.run('PRAGMA synchronous = OFF;');   // 500倍+   1万/62秒

    for (let i = 0; i < 100000; i++) {
        await sqlite3Promise.run(SQL_INSERT, ["压缩包.zip", "H:\\gitee\\GISFileMana\\node_modules\\@szmarczak\\http-timer\\source" + i, 32]);
    }

    await sqlite3Promise.commitTransaction();

    let list = await sqlite3Promise.run(SQL_SELECT);
    console.log(list[0]);
    console.timeEnd("运行main03");
}

// 开启Sql语句聚合 node-sqlite3 ，百万/4.2秒， 23.8万并发 / 秒
async function main04() {
    console.time("运行main04");
    await sqlite3Promise.open(__dirname + "/db.sqlite");

    await sqlite3Promise.run(SQL_CREATETable);

    // await sqlite3Promise.run('PRAGMA checkpoint = 10000');   // 2倍+  没啥提升
    // await sqlite3Promise.run('PRAGMA cache_size = 8000');   // 2倍+  没啥提升
    let sqlStr = "INSERT INTO file_info (file_name,file_full_path,file_size) VALUES ('压缩包.zip', 'H:\\gitee\\GISFileMana\\node_modules\\@szmarczak\\http-timer\\source\-1', 32)";
    for (let i = 0; i < 10000; i++) {
        sqlStr += `,('压缩包.zip', 'H:\\gitee\\GISFileMana\\node_modules\\@szmarczak\\http-timer\\source${i}', 32)`;
        // pb.render({completed: i, total: 10000});
    }

    await sqlite3Promise.run(sqlStr);
    let list = await sqlite3Promise.run(SQL_SELECT);
    console.log(list[0]);
    console.timeEnd("运行main04");
}


(async () => {
    // await main01();
    // await main02();
    // await main03();
    await main04();
})();



