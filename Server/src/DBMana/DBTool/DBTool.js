const fs = require('fs');
const path = require('path');
const sqlite3Promise = require('./sqlite3-promise.js');
const FSTool = require('../../Lib/FSTool/index.js');
const zlibPromise = require('../../Lib/FSTool/gzip.js');
const compressible = require('../../Lib/FSTool/compressible.js');


class DBTool {
    constructor(name) {
        let that = this;
        that.dbName = name;
        that.fileName = name + '.sqlite3';
        that.fullPath = path.join(FSTool.basePath + '/MapDB', that.fileName);
        that.schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    }

    init = async function () {
        await sqlite3Promise.open(this.fullPath);
        await sqlite3Promise.exec(this.schema);
        await sqlite3Promise.close();
    };

    // 将磁盘路径下的全部文件，读入数据库中
    packFile = async function (basePath, progressFunc) {
        let that = this;

        let fileList = await FSTool.getFileList(basePath);
        let unitObject = {};
        unitObject.count = fileList.length;
        unitObject.index = 0;
        unitObject.progressFunc = progressFunc;

        // 扫描完成的文件列表
        let completeInfoList = [];
        let threadIndex = 0;

        await FSTool.getFileInfoList({
            fileList,
            progressFunc,
            phasedFunc: async function (phasedInfoList) {
                while (phasedInfoList.length > 0) {
                    completeInfoList.push(phasedInfoList.pop());
                }
                await that.insertData(completeInfoList, unitObject);
                threadIndex++;
                // typeof progressFunc === 'function' && progressFunc({description: '线程工作成果保存，', completed: threadIndex, total: 4});
            },
            basePath: basePath
        });
    };

    insertData = async function (completeInfoList, option) {
        await sqlite3Promise.open(this.fullPath);
        let fileInfoSql = 'INSERT INTO file_info  (file_name, file_path, file_zip, file_size, file_md5) VALUES ( ?, ?, ?, ?, ?)';

        let fileDataSql = 'INSERT INTO file_data (file_md5, file_data) VALUES (?, ?)';

        let ProgressNumber = Math.floor(completeInfoList.length / 10);    // 避免过度频繁的通信
        let reportProgress = 0;     // 计数标识符

        await sqlite3Promise.beginTransaction();

        while (completeInfoList.length > 0) {
            let fileItem = completeInfoList.pop();
            let buffer = fileItem.buffer;
            let compressType = '';
            // 压缩二进制流
            if (compressible(fileItem.fullPath)) {
                buffer = await zlibPromise.zip(buffer);
                compressType = 'gzip';
            }
            await sqlite3Promise.insertData(fileInfoSql, [
                fileItem.fileName,
                fileItem.relativePath.replace(fileItem.fileName, ''),
                compressType,
                fileItem.size,
                fileItem.md5
            ]);
            await sqlite3Promise.insertData(fileDataSql, [fileItem.md5, buffer]);
            option.index++;

            reportProgress++;
            if (reportProgress === ProgressNumber) {
                reportProgress = 0;
                typeof option.progressFunc === 'function' && option.progressFunc(
                    {description: '磁盘文件导入数据库进度', completed: option.index, total: option.count}
                );
            }
        }

        await sqlite3Promise.commitTransaction();
        await sqlite3Promise.close();
    };

    exportFile = async function (path, progressFunc) {
        await sqlite3Promise.open(this.fullPath);
        let list = await sqlite3Promise.all('select * from file_list');

        for (let i = 0; i < list.length; i++) {
            let file = list[i];

            let fileData = file.file_zip === 'gzip' ? await zlibPromise.unzip(file.file_data) : file.file_data;

            await FSTool.createFile((path || `${FSTool.basePath}/OutFile`) + `/${this.dbName}${file.file_full_path}`, fileData);

            typeof progressFunc === 'function' && progressFunc(
                {description: '文件导出', completed: i + 1, total: list.length}
            );
        }
        await sqlite3Promise.close();
    };

    // 获取文件列表
    getFileList = async function () {
        await sqlite3Promise.open(this.fullPath);
        const list = await sqlite3Promise.all('select * from file_info');
        await sqlite3Promise.close();
        return list;
    };

    // 获取目录的树状图结构
    getPathList = async function () {
        await sqlite3Promise.open(this.fullPath);
        const listObj = await sqlite3Promise.all('select distinct file_path from file_info');
        await sqlite3Promise.close();
        const list = [];
        listObj.forEach(e => list.push(e['file_path']));

        return list;
    };

    // 根据目录获取文件
    getFileListByPath = async function (path) {
        await sqlite3Promise.open(this.fullPath);
        const list = await sqlite3Promise.all('select *  from file_info where file_path = ?', [path]);
        await sqlite3Promise.close();
        return list;
    };

    // 读取文件
    getFileByFullPath = async function (filePath) {
        let fileName = path.basename(filePath);
        let dirPath = path.dirname(filePath);
        await sqlite3Promise.open(this.fullPath);
        const list = await sqlite3Promise.all('select *  from file_list where file_path = ? and file_name = ?', [fileName, dirPath]);
        await sqlite3Promise.close();
        return list;
    };

    // 读取文件
    getFileByMd5 = async function (MD5) {
        await sqlite3Promise.open(this.fullPath);
        const list = await sqlite3Promise.all('select *  from file_list where file_md5 = ?', [MD5]);
        await sqlite3Promise.close();
        return list;
    };
}


module.exports = DBTool;
