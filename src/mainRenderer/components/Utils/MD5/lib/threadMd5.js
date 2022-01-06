const path = require('path');
const calcFileInfo = require('./calcFileInfo.js');
const sqlite3Promise = require('../../../DBMana/DBTool/sqlite3-promise.js');
const FSTool = require('../../FSTool.js');

async function openDB(dbName) {
    const cacheSql = FSTool.readFileSync(path.join(__dirname, 'cache.sql'), 'utf8');
    const dbPath = FSTool.basePath + '/Cache/' + dbName + '.db';
    await FSTool.deleteFile(dbPath);
    await sqlite3Promise.open(dbPath);
    await sqlite3Promise.exec(cacheSql);
}

async function closeDB() {
    await sqlite3Promise.close();
}

async function insertData(fileInfoList) {
    let fileInfoSql = 'INSERT INTO cache  (fileName, fullPath, relativePath, buffer, md5, file_size) VALUES ( ?, ?, ?, ?, ?, ?)';

    await sqlite3Promise.beginTransaction();

    while (fileInfoList.length > 0) {
        let fileItem = fileInfoList.pop();
        await sqlite3Promise.insertData(fileInfoSql, [
            fileItem.fileName,
            fileItem.fullPath,
            fileItem.relativePath,
            fileItem.buffer,
            fileItem.md5,
            fileItem.size
        ]);
    }

    await sqlite3Promise.commitTransaction();
}

/**
 * 子进程，用于计算文件的 MD5 值
 *
 * threadName 进程名称，标识符
 * threadPathList   一组文件的绝对路径数组
 * basePath     这些文件的基础路径
 * maxMemory  内存上限
 */
process.on('message',
    async function ({threadName, threadPathList, basePath}) {
        let maxMemory = 200 << 10;     // 子进程最大的内存限制 ，默认 200MB

        await openDB(threadName);

        // 最终运行成果，先准备一个空数值
        let md5List = [];

        // 每计算出 ProgressNumber 个文件的详细信息，就向主进程汇报一次进度
        let ProgressNumber = 100;    // 避免过度频繁的 主进程-子进程 通信
        let reportProgress = 0;     // 计数标识符
        let bufferTotal = 0;        // 累积使用的，内存计数
        let count = threadPathList.length;  // 全部需要运算的【文件路径列表】长度

        // 根据 Buffer 计算 MD5 值
        for (let i = 0; i < count; i++) {
            let filePath = threadPathList[i];
            let fileInfo = await calcFileInfo(filePath, basePath);
            md5List.push(fileInfo);


            // 向主进程汇报进度，并重新开始计数
            reportProgress++;
            if (reportProgress === ProgressNumber) {
                reportProgress = 0;
                process.send({message: 'Progress', data: ProgressNumber});
            }

            // 超出内存了，把当前这部分的数据弹出进程。
            bufferTotal += fileInfo.size;
            if (typeof maxMemory === 'number' && bufferTotal > maxMemory) {
                bufferTotal = 0;

                await insertData(md5List);
                // 释放内存
                md5List.length = 0;
            }
        }
        await insertData(md5List);
        await closeDB();

        // 释放内存
        threadPathList.length = 0;
        md5List.length = 0;

        // 补足向主进程汇报到 100 %
        process.send({message: 'Progress', data: reportProgress});

        // 结束子进程
        process.send({message: 'Complete', data: []});
    }
);

