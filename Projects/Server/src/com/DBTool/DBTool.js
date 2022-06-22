const fs = require('fs');
const path = require('path');
const lodash = require('lodash');
const configTool = require('../configTool.js');
const Sqlite3Promise = require('./Sqlite3Promise.js');
const FSTool = require('../../lib/FSTool/index.js');
const zlibPromise = require('../../lib/FSTool/gzip.js');
const awaitWrap = require('../../lib/awaitWrap.js');
const ProgressBar = require('../ProgressBar/ProgressBar.js');
const webSocketTool = require('../webSocketTool/webSocketTool.js');
const schema = require('./schema.js');

class DBTool {
    constructor(name) {
        let that = this;
        that.dbName = name;
        that.fileName = name + '.sqlite3';
        that.pathInfoList = [];
    }

    // 判断该数据库是否存在
    static HasDB = async function (DBName) {
        await configTool.init();
        let filePathList = await FSTool.getFileList(path.join(configTool.appBasePath, `/temp/fileDB`));
        let has = false;
        filePathList.forEach(item => {
            if (DBName + '.sqlite3' === path.basename(item)) has = true;
        });
        return has;
    };
    // 获取资源库列表
    static getDBList = async function () {
        await configTool.init();
        let filePathList = await FSTool.getFileList(path.join(configTool.appBasePath, `/temp/fileDB`));

        let fileInfoList = [];

        for (let i = 0; i < filePathList.length; i++) {
            let filePath = filePathList[i];
            let fileName = path.basename(filePath).replace('.sqlite3', '');
            let extName = path.extname(filePath);
            let info = await FSTool.getPathInfo(filePath, false);
            if (info === null) continue;
            let size = info.size;
            let sizeFormat = null;

            if (size < 1024) {
                sizeFormat = size + 'KB';
            } else if (size < 1024 * 1024) {
                sizeFormat = (size / 1024).toFixed(2) + 'MB';
            } else if (size < 1024 * 1024 * 1024) {
                sizeFormat = (size / 1024 / 1024).toFixed(2) + 'GB';
            }

            if (extName === '.sqlite3') {
                let dbTool = new DBTool(fileName);
                let mataData = await dbTool.getMataData();
                mataData.fileCount = await dbTool.getMataData().then(data => data.fileCount);
                if (!mataData.fileCount) {
                    await dbTool.getPathInfoList();
                    mataData.fileCount = await dbTool.getMataData().then(data => data.fileCount);
                }
                await dbTool.close();
                fileInfoList.push({id: i, fileName, filePath, size, sizeFormat, mataData});
            }
        }

        return fileInfoList;
    };
    // 创建资源库
    static createDB = async function (DBName, targetDirectory, mataData = {}) {
        await configTool.init();
        // 获取映射目录 的信息
        let targetDirectoryInfo = await FSTool.getPathInfo(targetDirectory);

        // 资源库 信息
        let mes;

        // 该映射目录是有效文件夹，并且目录下没有同名 sqlite3 文件
        if (targetDirectoryInfo && targetDirectoryInfo.isDirectory) {
            let dbTool = new DBTool(DBName);
            await dbTool.connect();
            let pg = new ProgressBar('创建资源库', 40);
            await dbTool.packFile(targetDirectory, null, function (e) {
                e.action = 'runProgress';
                pg.render(e);
                // 发生进度信息
                webSocketTool.send(JSON.stringify(e));
            });
            await dbTool.setMataData(mataData);
            webSocketTool.send(JSON.stringify({description: '创建资源库完成', completed: 2, total: 2, action: 'runProgress'}));
            mes = '创建资源库成功';
        } else {
            mes = `失败，该目录下已有同名资源库：${targetDirectory}`;
        }

        return mes;
    };
    // 追加文件
    static appendFile = async function (DBName, targetDirectory, currentDirectory) {
        await configTool.init();
        // 获取映射目录 的信息
        let targetDirectoryInfo = await FSTool.getPathInfo(targetDirectory);

        // 资源库 信息
        let mes;

        if (targetDirectoryInfo && targetDirectoryInfo.isDirectory) {
            let dbTool = new DBTool(DBName);
            await dbTool.connect();
            let pg = new ProgressBar('追加文件', 40);
            await dbTool.packFile(targetDirectory, currentDirectory, function (e) {
                e.action = 'runProgress';
                pg.render(e);
                // 发生进度信息
                webSocketTool.send(JSON.stringify(e));
            });
            webSocketTool.send(JSON.stringify({description: '追加文件', completed: 2, total: 2, action: 'runProgress'}));

            mes = '创建资源库成功';
        } else {
            mes = `失败，该目录下已有同名资源库：${targetDirectory}`;
        }

        return mes;

    };
    // 导出资源库
    static exportDB = async function (DBName, targetDirectory) {
        await configTool.init();
        // 映射目录 的信息
        let targetDirectoryInfo = await FSTool.getPathInfo(targetDirectory);

        let res = false;
        // 该映射目录是有效文件夹，并且目录下没有同名 sqlite3 文件
        if (targetDirectoryInfo && targetDirectoryInfo.isDirectory) {
            console.log(`开始导出资源库：${DBName}`);
            let dbTool = new DBTool(DBName);
            let pg = new ProgressBar('导出资源库', 40);
            await dbTool.exportFile(targetDirectory, function (e) {
                e.action = 'runProgress';
                pg.render(e);
                // 发生进度信息
                webSocketTool.send(JSON.stringify(e));
            });
            webSocketTool.send(JSON.stringify({description: '导出资源库完成', completed: 1, total: 1, action: 'runProgress'}));
            res = true;
        }
        return res;
    };
    // 删除数据库
    static deleteDB = async function (DBName) {
        await configTool.init();
        return FSTool.deleteFile(path.join(configTool.appBasePath, `/temp/fileDB`, DBName + '.sqlite3'));
    };

    // 打开数据库连接
    connect = async function () {
        let that = this;
        await configTool.init();
        that.fullPath = that.fullPath || path.join(configTool.appBasePath + '/temp/fileDB', that.fileName);
        that.sqlite3Promise = that.sqlite3Promise || new Sqlite3Promise(that.fullPath);

        if (that.sqlite3Promise.db) {
            return 'Open';
        }

        return new Promise(resolve => {
            fs.promises.access(that.fullPath).then(async () => {
                await that.sqlite3Promise.open(that.fullPath);
                await that.sqlite3Promise.exec(schema);
                resolve('Connect');
            }).catch(async () => {
                await that.sqlite3Promise.open(that.fullPath);
                await that.sqlite3Promise.exec(schema);
                resolve('Create');
            });
        });
    };

    // 对全部的路径进行扫描统计
    getPathInfoList = async function () {
        let that = this;
        if (this.pathInfoList.length > 0) return this.pathInfoList;

        // 全部文件夹
        let realtimePathList = await this.sqlite3Promise.all('select distinct file_path from file_info');
        realtimePathList = realtimePathList.map(item => item.file_path);
        let realtimePathMet = new Map();
        for (let i = 0; i < realtimePathList.length; i++) {
            FSTool.pathSplit(realtimePathList[i]).forEach(item => {
                realtimePathMet.set(item, {path: item, file_count: 0, total_size: 0});
            });
        }

        // 各目录下，文件数量、总大小
        let pathInfoList = await this.sqlite3Promise.all('SELECT file_path,count( file_size ) AS file_count,sum( file_size ) AS total_size FROM file_info GROUP BY file_path');
        for (let i = 0; i < pathInfoList.length; i++) {
            FSTool.pathSplit(pathInfoList[i].file_path).forEach(item => {
                realtimePathMet.get(item).file_count += pathInfoList[i].file_count;
                realtimePathMet.get(item).total_size += pathInfoList[i].total_size;
            });
        }


        realtimePathList = [];
        for (const [key] of realtimePathMet) {
            realtimePathList.push(realtimePathMet.get(key));
        }

        this.pathInfoList = realtimePathList;
        let mataData = await that.getMataData();
        mataData.fileCount = realtimePathMet.get('\\').file_count;
        mataData.totalSize = realtimePathMet.get('\\').total_size;
        await that.setMataData(mataData);
        return realtimePathList;
    };


    // 获取目录结构
    getDBPathTree = async function () {
        let that = this;
        await that.connect();
        let pathInfoList = await that.getPathInfoList();
        const treeDTO = [];
        pathInfoList.forEach(({path, file_count, total_size}) => {
            const nodeArray = path.split('\\');
            let children = treeDTO;
            // 循环构建子节点
            for (const i of nodeArray) {
                const node = {
                    name: i
                };
                if (children.length === 0) {
                    children.push(node);
                }
                let isExist = false;
                for (const j in children) {
                    if (children[j].name === node.name) {
                        if (!children[j].children) {
                            children[j].children = [];
                        }
                        children = children[j].children;
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) {
                    children.push(node);
                    if (!children[children.length - 1].children) {
                        children[children.length - 1].children = [];
                    }
                    children = children[children.length - 1].children;
                }
            }
        });

        treeDTO[0].name = that.dbName;

        return treeDTO;
    };

    // 获取当前路径下的【文件夹、文件】列表
    getDirListByPath = async function (dirPath) {
        let that = this;
        await that.connect();
        // 获取全部 文件夹 列表
        let pathInfoList = await that.getPathInfoList();

        // 构造文件夹对象
        let itemFolder = [];
        let set = new Set();
        let matchPathItem = dirPath.split('\\').filter(p => p !== '');


        pathInfoList.forEach(({path, file_count, total_size}) => {
            let sourcePathItem = path.split('\\').filter(p => p !== '');
            let matchArr = sourcePathItem.slice(0, matchPathItem.length);
            if (JSON.stringify(matchPathItem) === JSON.stringify(matchArr)) {
                let pathItem = path.replace(dirPath, '').split('\\').filter(p => p !== '');
                let childPath = pathItem[0];
                if (childPath && !set.has(childPath)) {
                    set.add(childPath);
                    itemFolder.push({
                        ext: 'directory', file_name: childPath, file_path: dirPath + childPath + '\\'
                    });
                }
            }
        });


        // 获取 文件 列表
        let fileList = await that.getFileListByPath(dirPath);
        for (let i = 0; i < fileList.length; i++) {
            fileList[i].ext = path.extname(fileList[i].file_name);
        }


        return [...itemFolder, ...fileList];
    };


    /**
     * 将磁盘路径下的全部文件，读入数据库中
     * @param targetDirectory       映射文件夹的绝对路径
     * @param currentDirectory      需要读入数据库的，目录相对路径
     * @param progressFunc          回调函数，返回打包进度
     * @returns {Promise<void>}
     */
    packFile = async function (targetDirectory, currentDirectory, progressFunc) {
        let that = this;

        let filePathList = await FSTool.getFileList(targetDirectory);

        let unitObject = {};
        unitObject.count = filePathList.length;
        unitObject.index = 0;
        unitObject.progressFunc = progressFunc;
        unitObject.beginTime = new Date().getTime();
        let chunkSize = Math.ceil(filePathList.length / 100);
        chunkSize = chunkSize < 2000 ? chunkSize : 2000;

        console.log(`统计文件完成，共计：${filePathList.length}项`);
        console.time('数据打包入库');
        let filePathChunk = lodash.chunk(filePathList, chunkSize);

        let fileBufferSize = 0;
        let miniFilePathList = [];        // 小文件（1~8kb）列表
        let largeFilePathList = [];       // 大文件（>8kb）列表

        while (filePathChunk.length > 0) {
            let filePathChunkList = filePathChunk.shift();
            let fileInfoList = await FSTool.getFileInfoList({
                filePathList: filePathChunkList, rootPath: targetDirectory
            });

            fileInfoList.map(fileInfo => {
                fileInfo.relativePath = path.join(currentDirectory || '', fileInfo.relativePath);
                return fileInfo;
            });

            for (let j = 0; j < fileInfoList.length; j++) {
                fileBufferSize += fileInfoList[j].size / 1024;
                // 对扫描到的文件，根据文件是否大于 8kb 进分类
                if (fileInfoList[j].size < 1024 * 8) {
                    miniFilePathList.push(fileInfoList[j]);
                } else {
                    largeFilePathList.push(fileInfoList[j]);
                }
            }


            // 小文件，存储到了一个阈值，进行入库
            if (miniFilePathList.length > 1_0000) {
                await that.insertData(miniFilePathList, unitObject, 'mini');
                fileBufferSize = 0;
                miniFilePathList = [];
            }

            // 大文件，存储到了一个阈值，进行入库
            if (fileBufferSize > 50 || largeFilePathList.length > 5000) {
                await that.insertData(largeFilePathList, unitObject, 'large');
                fileBufferSize = 0;
                largeFilePathList = [];
            }
        }

        await that.insertData(miniFilePathList, unitObject, 'mini');
        await that.insertData(largeFilePathList, unitObject, 'large');


        console.timeEnd('数据打包入库');
        that.pathInfoList = [];
        await that.close();
    };

    insertData = async function (completeInfoList, option = null, insertType = 'large', transaction = true) {
        let that = this;
        await that.connect();

        let fileInfoSql = 'INSERT OR IGNORE INTO file_info  (file_name, file_path, file_zip, file_size, file_md5) VALUES ';
        let fileInfoSqlSum = fileInfoSql;

        let fileDataSql = 'INSERT OR IGNORE INTO file_data (file_md5, file_data) VALUES ';
        let fileDataSqlSum = fileDataSql;

        let ProgressNumber = 82;    // 避免过度频繁的通信
        let reportProgress = 0;     // 计数标识符

        transaction && await this.sqlite3Promise.beginTransaction();

        while (completeInfoList.length > 0) {
            let fileItem = completeInfoList.pop();
            let buffer = fileItem.buffer;

            if (completeInfoList.length === 0 || fileInfoSqlSum.length > 1024 * 1024 * 250) {
                fileInfoSqlSum += `('${fileItem.fileName}', '${fileItem.relativePath.replace(fileItem.fileName, '')}', '${fileItem.compressType}', ${fileItem.size}, '${fileItem.md5}'),`;

                await this.sqlite3Promise.insertData(fileInfoSqlSum.substring(0, fileInfoSqlSum.length - 1));
                fileInfoSqlSum = fileInfoSql;
            } else {
                fileInfoSqlSum += `('${fileItem.fileName}', '${fileItem.relativePath.replace(fileItem.fileName, '')}', '${fileItem.compressType}', ${fileItem.size}, '${fileItem.md5}'),`;
            }


            if (insertType === 'mini') {
                if (completeInfoList.length === 0 || fileDataSqlSum.length > 1024 * 1024 * 250) {
                    fileDataSqlSum += `('${fileItem.md5}', X'${buffer.toString('hex')}'),`;

                    await this.sqlite3Promise.insertData(fileDataSqlSum.substring(0, fileDataSqlSum.length - 1));
                    fileDataSqlSum = fileDataSql;
                } else {
                    fileDataSqlSum += `('${fileItem.md5}', X'${buffer.toString('hex')}'),`;
                }
            } else if (insertType === 'large') {
                await this.sqlite3Promise.insertData(fileDataSql + '( ?, ?)', [fileItem.md5, buffer]);
            }

            option && option.index++;

            reportProgress++;
            if (reportProgress === ProgressNumber) {
                reportProgress = 0;
                typeof option?.progressFunc === 'function' && option.progressFunc({
                    description: '磁盘文件导入数据库进度',
                    completed: option.index,
                    total: option.count,
                    passTime: Math.ceil((new Date().getTime() - option.beginTime) / 1000)
                });
            }
        }

        typeof option?.progressFunc === 'function' && option.progressFunc({
            description: '磁盘文件导入数据库进度',
            completed: option.index,
            total: option.count,
            passTime: Math.ceil((new Date().getTime() - option.beginTime) / 1000)
        });

        transaction && await this.sqlite3Promise.commitTransaction();
    };

    exportFile = async function (path, progressFunc) {
        let that = this;
        await that.connect();

        let [{count}] = await this.sqlite3Promise.all('select max(file_gid) as count from file_list');
        let index = 0;

        let pageCount = Math.ceil(count / 5000);

        for (let i = 0; i < pageCount; i++) {
            let list = await this.sqlite3Promise.all('select * from file_list WHERE ?<=file_gid and file_gid<? limit 5000', [i * 5000, (i + 1) * 5000]);

            let pList = [];
            while (list.length > 0) {
                let fileItem = list.pop();
                index++;

                pList.push(new Promise(async (resolve) => {
                    let fileData = fileItem.file_zip === 'gzip' ? await zlibPromise.unzip(fileItem.file_data) : fileItem.file_data;
                    await FSTool.createFileAsync((path || `${configTool.appBasePath}/OutFile`) + `/${this.dbName}${fileItem.file_full_path}`, fileData);
                    typeof progressFunc === 'function' && progressFunc({
                        description: '文件导出', completed: index, total: count
                    });
                    resolve();
                }));


                if (list.length === 0) {
                    await Promise.all(pList);
                    pList = [];
                }
            }

            await Promise.all(pList);
        }
    };


    // 根据目录获取文件
    getFileListByPath = async function (path) {
        let that = this;
        await that.connect();
        return await this.sqlite3Promise.all('select *  from file_info where file_path = ?', [path]);
    };

    // 根据文件夹路径，dirPath：'\\12\\'
    getDirInfo = async function (dirPath) {
        let that = this;
        await that.connect();

        let pathInfoList = await that.getPathInfoList();
        let dirInfo = pathInfoList.find(item => item.path === dirPath);
        let count = dirInfo.file_count;
        let totalSize = dirInfo.total_size;

        if (totalSize < 1024) {
            totalSize = totalSize + 'b';
        } else if (totalSize < 1024 * 1024) {
            totalSize = (totalSize / 1024).toFixed(2) + 'Kb';
        } else if (totalSize < 1024 * 1024 * 1024) {
            totalSize = (totalSize / 1024 / 1024).toFixed(2) + 'MB';
        } else if (totalSize < 1024 * 1024 * 1024 * 1024) {
            totalSize = (totalSize / 1024 / 1024 / 1024).toFixed(2) + 'GB';
        }

        return {
            childFileCount: count, childFileTotalSize: totalSize
        };
    };

    getMataData = async function () {
        let that = this;
        await that.connect();
        let attrList = await this.sqlite3Promise.all('select * from metadata');
        let mataData = {};
        attrList.forEach(e => mataData[e.name] = e.value);

        return mataData;
    };

    setMataData = async function (mataData = {}) {
        let that = this;
        await that.connect();
        for (const name in mataData) {
            await this.sqlite3Promise.insertData('INSERT OR IGNORE INTO metadata (name, value) VALUES ( ?, ?)', [name, mataData[name]]);
            await this.sqlite3Promise.run('update metadata set value = ? where name = ?', [mataData[name], name]);
        }
        return '修改元数据成功';
    };

    // 根据目录获取文件
    getFileListBySearch = async function (text) {
        let that = this;
        await that.connect();
        return await this.sqlite3Promise.all(`select *
                                              from file_info
                                              where file_name like '%${text}%'
                                                 OR file_path like '%${text}%' LIMIT 200`);
    };

    // 读取文件
    // \0\0\0.png
    getFileByFullPath = async function (fullPath = '', unzip = true) {
        let that = this;
        await that.connect();

        let fileName = path.basename(fullPath);
        let filePath = path.dirname(fullPath).replaceAll('/', '\\');
        filePath = filePath.endsWith('\\') ? filePath : filePath + '\\';

        const [err, list] = await awaitWrap(this.sqlite3Promise.all('select * from file_list where file_name = ? and file_path = ?', [fileName, filePath]));
        let file;
        if (err || list.length === 0) {
            file = null;
        } else {
            file = list.pop();
            file.file_data = unzip && file.file_zip === 'gzip' ? await zlibPromise.unzip(file.file_data) : file.file_data;
        }
        return file;
    };

    // 读取文件
    getFileByMd5 = async function (MD5 = '', unzip = true) {
        let that = this;
        await that.connect();
        const [err, list] = await awaitWrap(this.sqlite3Promise.all('select *  from file_list where file_md5 = ?', [MD5]));
        let file;
        if (err || list.length === 0) {
            file = null;
        } else {
            file = list.pop();
            file.file_data = unzip && file.file_zip === 'gzip' ? await zlibPromise.unzip(file.file_data) : file.file_data;
        }
        return file;
    };

    deleteByDir = async function (dir) {
        let that = this;
        await that.connect();
        dir = dir.replaceAll('/', '\\');
        dir = `${dir}%`;
        const [err, res] = await awaitWrap(this.sqlite3Promise.run('delete from file_info where file_path like ?', [dir]));

        that.pathInfoList = [];
        return res;
    };

    deleteByFullPath = async function (fullPath) {
        let that = this;
        await that.connect();
        let fileName = path.basename(fullPath);
        let filePath = fullPath.replaceAll(fileName, '');
        filePath = filePath.replaceAll('/', '\\');
        const [err, res] = await awaitWrap(this.sqlite3Promise.run('delete from file_info where file_path = ? and file_name = ?', [filePath, fileName]));

        that.pathInfoList = [];
        return res;
    };

    wipeCache = async function () {
        let that = this;
        await that.connect();
        const [err, list] = await awaitWrap(this.sqlite3Promise.all(`
                            SELECT
                                file_data.file_md5 
                            FROM
                                file_data
                            LEFT JOIN file_info ON file_data.file_md5 = file_info.file_md5 
                            WHERE
                                file_info.file_gid ISNULL
        `));
        for (let i = 0; list && i < list.length; i++) {
            await awaitWrap(this.sqlite3Promise.run('delete from file_data where file_md5 = ?', [list[i].file_md5]));
        }
        await awaitWrap(this.sqlite3Promise.run('VACUUM'));
        return true;
    };

    // 断开数据库连接
    close = async function () {
        await this.sqlite3Promise.close();
    };
}


module.exports = DBTool;
