const sqlite3 = require('sqlite3').verbose();

const db = {
    db: null,
    open: function (path) {
        let that = this;
        return new Promise(function (resolve) {
            that.db = new sqlite3.Database(path,
                function (err) {
                    resolve(that.db);
                }
            );
        });
    },

    // any query: insert/delete/update
    run: function (query, params) {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.db.run(query, params,
                function (err) {
                    if (err) reject(err.message);
                    else resolve(true);
                });
        });
    },

    // first row read
    get: function (query, params) {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.db.get(query, params, function (err, row) {
                if (err) reject('Read error: ' + err.message);
                else {
                    resolve(row);
                }
            });
        });
    },

    // set of rows read
    all: function (query, params) {
        let that = this;
        return new Promise(function (resolve, reject) {
            if (params === undefined) params = [];
            that.db.all(query, params, function (err, rows) {
                if (err) reject('Read error: ' + err.message);
                else {
                    resolve(rows);
                }
            });
        });
    },

    exec: function (sql) {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.db.exec(sql, function (err, rows) {
                if (err) reject('Read error: ' + err.message);
                else {
                    resolve(rows);
                }
            });
        });
    },

    // each row returned one by one
    each: function (query, params, action) {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.db.serialize(function () {
                that.db.each(query, params, function (err, row) {
                    if (err) reject('Read error: ' + err.message);
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
    },

    close: function () {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.db.close();
            resolve(true);
        });
    },


    beginTransaction:async function (){
        await this.run('BEGIN TRANSACTION;;');
    },
    commitTransaction:async function (){
        await this.run('COMMIT TRANSACTION;');
    },


    // var insertTileSql = "insert into tiles(level, column, row) values(?, ?, ?)";
    // var tileData = [1, 10, 10];
    insertData: function (sql, tileData) {
        let that = this;
        return new Promise(function (resolve) {
            that.db.run(sql, tileData, function (e) {
                resolve(e)
            })
        })
    }
};

module.exports = db;
