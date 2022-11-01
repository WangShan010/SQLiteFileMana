const sqlite3 = require('sqlite3').verbose();


class Sqlite3Promise {
    // @ts-ignore
    public db: sqlite3.Database | null;
    public path: string;
    public type: string;

    constructor(path: string, type = 'file') {
        this.db = null;
        this.path = path;
        this.type = type;
    }

    async open() {
        let that = this;
        return new Promise(function (resolve) {
            if (that.db) {
                resolve(that.db);
            } else if (that.type === 'memory') {
                that.db = new sqlite3.Database(':memory:');
                resolve(that.db);
            } else if (that.type === 'file') {
                that.db = new sqlite3.Database(that.path, function (err: any) {
                    resolve(that.db);
                });
            } else {
                console.log(`创建数据库失败，无法识别的类型${that.type}，仅支持：【file】 or 【memory】`);
                resolve(null);
            }
        });
    };

    // insert/delete/update
    async run(query: string, params: any) {
        let that = this;
        return new Promise(function (resolve, reject) {
            if (!params) params = [];
            that.db.run(query, params, function (err: any) {
                if (err) {
                    console.log(err);
                    reject('执行SQL语句失败：' + err.message);
                } else {
                    // @ts-ignore
                    let {lastID, changes} = this;
                    resolve({lastID, changes});
                }
            });
        });
    };

    // first row read
    async get(query: string, params: any) {
        let that = this;
        return new Promise(function (resolve, reject) {
            if (!params) params = [];
            that.db.get(query, params, function (err: any, row: any) {
                if (err) {
                    console.log(err);
                    reject('读取数据失败：' + err.message);
                } else {
                    resolve(row);
                }
            });
        });
    };

    // set of rows read
    async all(query: string, params: any): Promise<any[]> {
        let that = this;
        return new Promise(function (resolve, reject) {
            if (!params) params = [];
            that.db.all(query, params, function (err: any, row: any[]) {
                if (err) {
                    console.log(err);
                }

                resolve(row || []);
            });
        });
    }

    // 执行 SQL 语句，建表、修改数据库结构
    async exec(sql: string) {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.db.exec(sql, function (err: any, rows: any) {
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
    async each(query: string, params: any, action: any) {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.db.serialize(function () {
                that.db.each(query, params, function (err: any, row: any) {
                    if (err) {
                        console.log(err);
                        reject('Read error: ' + err.message);
                    } else {
                        if (row) {
                            action(row);
                        }
                    }
                });
                that.db.get('', function (err: any, row: any) {
                    resolve(true);
                });
            });
        });
    };

    async close() {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.db && that.db.close();
            that.db = null;
            resolve(true);
        });
    };


    async beginTransaction() {
        await this.run('BEGIN TRANSACTION;;', null);
    };

    async commitTransaction() {
        await this.run('COMMIT TRANSACTION;', null);
    };


    // var insertTileSql = "insert into tiles(level, column, row) values(?, ?, ?)";
    // var tileData = [1, 10, 10];
    async insertData(sql: string, tileData: any[]) {
        let that = this;
        return new Promise(function (resolve) {
            that.db.run(sql, tileData, function (err: any) {
                // @ts-ignore
                let {lastID, changes} = this;
                if (err) {
                    console.log(err);
                }
                resolve({lastID, changes});
            });
        });
    };
}


export = Sqlite3Promise;
