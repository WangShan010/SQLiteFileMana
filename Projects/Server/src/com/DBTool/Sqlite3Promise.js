const sqlite3 = require('sqlite3').verbose();


class Sqlite3Promise {
    constructor(path, type = 'file') {
        this.db = null;
        this.path = path;
        this.type = type;
    }

    open = function () {
        let that = this;
        return new Promise(function (resolve) {
            if (that.db) {
                resolve(that.db);
            } else if (that.type === 'memory') {
                that.db = new sqlite3.Database(':memory:');
                resolve(that.db);
            } else if (that.type === 'file') {
                that.db = new sqlite3.Database(that.path, function (err) {
                    resolve(that.db);
                });
            } else {
                console.log(`创建数据库失败，无法识别的类型${that.type}，仅支持：【file】 or 【memory】`);
                resolve(null);
            }
        });
    };

    // any query: insert/delete/update
    run = function (query, params) {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.db.run(query, params, function (err) {
                if (err) {
                    console.log(err);
                    reject(err.message);
                } else {
                    let {lastID, changes} = this;
                    resolve({lastID, changes});
                }
            });
        });
    };

    // first row read
    get = function (query, params) {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.db.get(query, params, function (err, row) {
                if (err) reject('Read error: ' + err.message); else {
                    resolve(row);
                }
            });
        });
    };

    // set of rows read
    all = function (query, params) {
        let that = this;
        return new Promise(function (resolve, reject) {
            if (params === undefined) params = [];
            that.db.all(query, params, function (err, rows) {
                if (err) {
                    console.log(err);
                    reject('Read error: ' + err.message);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    exec = function (sql) {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.db.exec(sql, function (err, rows) {
                if (err) {
                    console.log(err);
                    reject('Read error: ' + err.message);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    // each row returned one by one
    each = function (query, params, action) {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.db.serialize(function () {
                that.db.each(query, params, function (err, row) {
                    if (err) {
                        console.log(err);
                        reject('Read error: ' + err.message);
                    } else {
                        if (row) {
                            action(row);
                        }
                    }
                });
                that.db.get('', function (err, row) {
                    resolve(true);
                });
            });
        });
    };

    close = function () {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.db && that.db.close();
            that.db = null;
            resolve(true);
        });
    };


    beginTransaction = async function () {
        await this.run('BEGIN TRANSACTION;;');
    };
    commitTransaction = async function () {
        await this.run('COMMIT TRANSACTION;');
    };


    // var insertTileSql = "insert into tiles(level, column, row) values(?, ?, ?)";
    // var tileData = [1, 10, 10];
    insertData = function (sql, tileData) {
        let that = this;
        return new Promise(function (resolve) {
            that.db.run(sql, tileData, function (err) {
                let {lastID, changes} = this;
                if (err) {
                    console.log(err);
                }
                resolve({lastID, changes});
            });
        });
    };
}


module.exports = Sqlite3Promise;
