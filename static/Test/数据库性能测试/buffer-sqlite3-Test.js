const Database = require("better-sqlite3");
let sqlite3 = require("sqlite3").verbose();
const sqlite3Promise = require("../../../src/mainRenderer/components/DBMana/DBTool/sqlite3-promise.js");
const ProgressBar = require("../../../src/mainRenderer/components/Utils/ProgressBar/ProgressBar.js");
let FSTool = require('../../../src/mainRenderer/components/Utils/FSTool.js');

let SQL_CREATETable = "CREATE TABLE IF NOT EXISTS file_data (file_md5 TEXT,file_data BLOB)";
let SQL_INSERT = "INSERT INTO file_data (file_md5,file_data) VALUES (?,?)";
let SQL_SELECT = "SELECT COUNT(file_md5) FROM file_data";

let fileBuffer= FSTool.readFileSync('D:\\GisFileMana\\FileResources\\DEM-wordHeights\\0\\0\\0.terrain')

let pb = new ProgressBar("数据库写入测试", 50);

// 常规 node-sqlite3 ，一万/101秒， 10并发 / 秒
async function main01() {
    console.time("运行main01");
    let db = new sqlite3.Database(__dirname + "/db.sqlite");
    db.serialize(function () {
        db.run(SQL_CREATETable);
        let stmt = db.prepare(SQL_INSERT);

        for (let i = 0; i < 1000; i++) {
            stmt.run("压缩包.zip", fileBuffer);
        }

        stmt.finalize();

        db.all(SQL_SELECT, function (err, data) {
            console.log(data[0]);
            console.timeEnd("运行main01");
        });
    });
    db.close();
}

// 常规 better-sqlite3 ，一万/90秒， 11并发 / 秒
async function main02() {
    console.time("运行main02");
    const db = new Database("foobar.db", {});

    db.prepare(SQL_CREATETable).run();

    const stmtINSERT = db.prepare(SQL_INSERT);

    for (let i = 0; i < 1000; i++) {
        stmtINSERT.run("压缩包.zip", fileBuffer);
    }

    let list = db.prepare(SQL_SELECT).all();
    console.log(list[0]);

    console.timeEnd("运行main02");
}

// 开启事务 node-sqlite3 ，十万/9秒， 1万1千并发 / 秒
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
        await sqlite3Promise.run(SQL_INSERT, ["压缩包.zip",fileBuffer]);
    }

    await sqlite3Promise.commitTransaction();

    let list = await sqlite3Promise.run(SQL_SELECT);
    console.log(list[0]);
    console.timeEnd("运行main03");
}


(async () => {
    // await main01();
    // await main02();
    await main03();

})();



