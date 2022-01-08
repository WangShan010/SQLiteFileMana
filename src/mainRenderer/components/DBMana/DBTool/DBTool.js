const fs = require('fs');
const path = require('path');
const sqlite3Promise = require('./sqlite3-promise.js');
const FSTool = require('../../Lib/FSTool/FSTool.js');
const zlibPromise = require('../../Utils/gzip.js');
const Compressible = require('../../Utils/Compressible.js');


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

        // 先开并行取出 60% 的数据列表
        let p1 = FSTool.getFileInfoList(fileList.splice(0, Math.abs(unitObject.count / 10)),
            async function (phasedInfoList) {
                while (phasedInfoList.length > 0) {
                    completeInfoList.push(phasedInfoList.pop());
                }
            },
            {basePath: basePath, log: false}
        );
        let p2 = FSTool.getFileInfoList(fileList.splice(0, Math.abs(unitObject.count / 10 * 5)),
            async function (phasedInfoList) {
                while (phasedInfoList.length > 0) {
                    completeInfoList.push(phasedInfoList.pop());
                }
            },
            {basePath: basePath, log: false}
        );


        // 已经查询好的文件实体列表，可以直接进行数据库插入操作
        await FSTool.getFileInfoList(fileList,
            async function (phasedInfoList) {
                while (phasedInfoList.length > 0) {
                    completeInfoList.push(phasedInfoList.pop());
                }

                await that.insertData(completeInfoList, unitObject);
            },
            {basePath: basePath, log: true}
        );

        await Promise.all([p1, p2]);

    };

    insertData = async function (completeInfoList, option) {
        await sqlite3Promise.open(this.fullPath);
        let fileInfoSql = 'INSERT INTO file_info  (file_name, file_full_path, file_path_location, file_zip, file_size, file_md5) VALUES ( ?, ?, ?, ?, ?, ?)';

        let fileDataSql = 'INSERT INTO file_data (file_md5, file_data) VALUES (?, ?)';

        await sqlite3Promise.beginTransaction();

        while (completeInfoList.length > 0) {
            let fileItem = completeInfoList.pop();
            let buffer = fileItem.buffer;
            let compressType = '';
            // 压缩二进制流
            if (Compressible(fileItem.fullPath)) {
                buffer = await zlibPromise.zip(buffer);
                compressType = 'gzip';
            }
            await sqlite3Promise.insertData(fileInfoSql, [
                fileItem.fileName,
                fileItem.relativePath,
                fileItem.relativePath.replace(fileItem.fileName, ''),
                compressType,
                fileItem.size,
                fileItem.md5
            ]);
            await sqlite3Promise.insertData(fileDataSql, [fileItem.md5, buffer]);
            option.index++;
            typeof option.progressFunc === 'function' && option.progressFunc(
                {description: '磁盘文件导入数据库进度', completed: option.index, total: option.count}
            );
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
        const listObj = await sqlite3Promise.all('select distinct file_path_location from file_info');
        await sqlite3Promise.close();
        const list = [];
        listObj.forEach(e => list.push(e['file_path_location']));

        return list;
    };

    // 根据目录获取文件
    getFileListByPath = async function (path) {
        await sqlite3Promise.open(this.fullPath);
        const list = await sqlite3Promise.all('select *  from file_info where file_path_location = ?', [path]);
        await sqlite3Promise.close();
        return list;
    };

    // 读取文件
    getFileByFullPath = async function (path) {
        await sqlite3Promise.open(this.fullPath);
        const list = await sqlite3Promise.all('select *  from file_list where file_full_path = ?', [path]);
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
