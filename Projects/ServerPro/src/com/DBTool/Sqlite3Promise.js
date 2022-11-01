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
    const sqlite3 = require('sqlite3').verbose();
    class Sqlite3Promise {
        db;
        path;
        type;
        constructor(path, type = 'file') {
            this.db = null;
            this.path = path;
            this.type = type;
        }
        async open() {
            let that = this;
            return new Promise(function (resolve) {
                if (that.db) {
                    resolve(that.db);
                }
                else if (that.type === 'memory') {
                    that.db = new sqlite3.Database(':memory:');
                    resolve(that.db);
                }
                else if (that.type === 'file') {
                    that.db = new sqlite3.Database(that.path, function (err) {
                        resolve(that.db);
                    });
                }
                else {
                    console.log(`创建数据库失败，无法识别的类型${that.type}，仅支持：【file】 or 【memory】`);
                    resolve(null);
                }
            });
        }
        ;
        async run(query, params) {
            let that = this;
            return new Promise(function (resolve, reject) {
                if (!params)
                    params = [];
                that.db.run(query, params, function (err) {
                    if (err) {
                        console.log(err);
                        reject('执行SQL语句失败：' + err.message);
                    }
                    else {
                        let { lastID, changes } = this;
                        resolve({ lastID, changes });
                    }
                });
            });
        }
        ;
        async get(query, params) {
            let that = this;
            return new Promise(function (resolve, reject) {
                if (!params)
                    params = [];
                that.db.get(query, params, function (err, row) {
                    if (err) {
                        console.log(err);
                        reject('读取数据失败：' + err.message);
                    }
                    else {
                        resolve(row);
                    }
                });
            });
        }
        ;
        async all(query, params) {
            let that = this;
            return new Promise(function (resolve, reject) {
                if (!params)
                    params = [];
                that.db.all(query, params, function (err, row) {
                    if (err) {
                        console.log(err);
                    }
                    resolve(row || []);
                });
            });
        }
        async exec(sql) {
            let that = this;
            return new Promise(function (resolve, reject) {
                that.db.exec(sql, function (err, rows) {
                    if (err) {
                        console.log(err);
                        reject('Read error: ' + err.message);
                    }
                    else {
                        resolve(rows);
                    }
                });
            });
        }
        ;
        async each(query, params, action) {
            let that = this;
            return new Promise(function (resolve, reject) {
                that.db.serialize(function () {
                    that.db.each(query, params, function (err, row) {
                        if (err) {
                            console.log(err);
                            reject('Read error: ' + err.message);
                        }
                        else {
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
        }
        ;
        async close() {
            let that = this;
            return new Promise(function (resolve, reject) {
                that.db && that.db.close();
                that.db = null;
                resolve(true);
            });
        }
        ;
        async beginTransaction() {
            await this.run('BEGIN TRANSACTION;;', null);
        }
        ;
        async commitTransaction() {
            await this.run('COMMIT TRANSACTION;', null);
        }
        ;
        async insertData(sql, tileData) {
            let that = this;
            return new Promise(function (resolve) {
                that.db.run(sql, tileData, function (err) {
                    let { lastID, changes } = this;
                    if (err) {
                        console.log(err);
                    }
                    resolve({ lastID, changes });
                });
            });
        }
        ;
    }
    return Sqlite3Promise;
});
//# sourceMappingURL=Sqlite3Promise.js.map