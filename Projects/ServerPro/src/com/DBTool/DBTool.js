var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "path", "../configTool.js", "./Sqlite3Promise.js", "../../lib/FSTool/index.js", "../../lib/FSTool/zlibPromise.js", "../../lib/awaitWrap.js", "../webSocketTool/webSocketTool.js", "../../lib/arrChunk.js", "./schema.js", "../../lib/ProgressBar/ProgressBar.js", "../../lib/YaoDo/index.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    const path_1 = __importDefault(require("path"));
    const configTool_js_1 = __importDefault(require("../configTool.js"));
    const Sqlite3Promise_js_1 = __importDefault(require("./Sqlite3Promise.js"));
    const index_js_1 = __importDefault(require("../../lib/FSTool/index.js"));
    const zlibPromise_js_1 = __importDefault(require("../../lib/FSTool/zlibPromise.js"));
    const awaitWrap_js_1 = __importDefault(require("../../lib/awaitWrap.js"));
    const webSocketTool_js_1 = __importDefault(require("../webSocketTool/webSocketTool.js"));
    const arrChunk_js_1 = __importDefault(require("../../lib/arrChunk.js"));
    const schema_js_1 = __importDefault(require("./schema.js"));
    const ProgressBar_js_1 = __importDefault(require("../../lib/ProgressBar/ProgressBar.js"));
    const index_js_2 = __importDefault(require("../../lib/YaoDo/index.js"));
    class DBTool {
        dbName = '';
        filePath = '';
        sqlite3Promise;
        constructor(name) {
            let that = this;
            that.dbName = name;
            that.filePath = '';
        }
        static HasDB = async function (DBName) {
            await configTool_js_1.default.init();
            let filePathList = await DBTool.getDBPathList();
            return filePathList.some((item) => DBName + '.sqlite3' === path_1.default.basename(item));
        };
        static getDBPathList = async function () {
            return await index_js_1.default.getFilePathList(path_1.default.join(configTool_js_1.default.appBasePath, `/temp/fileDB`));
        };
        static getDBInfoList = async function () {
            await configTool_js_1.default.init();
            let filePathList = await DBTool.getDBPathList();
            let fileInfoList = [];
            for (let i = 0; i < filePathList.length; i++) {
                let filePath = filePathList[i];
                let fileName = path_1.default.basename(filePath).replace('.sqlite3', '');
                let extName = path_1.default.extname(filePath);
                let info = await index_js_1.default.getPathInfo(filePath, false);
                if (info === null)
                    continue;
                let size = info.size;
                let sizeFormat = null;
                if (size < 1024) {
                    sizeFormat = size + 'KB';
                }
                else if (size < 1024 * 1024) {
                    sizeFormat = (size / 1024).toFixed(2) + 'MB';
                }
                else if (size < 1024 * 1024 * 1024) {
                    sizeFormat = (size / 1024 / 1024).toFixed(2) + 'GB';
                }
                if (extName === '.sqlite3') {
                    let dbTool = new DBTool(fileName);
                    let mataData = await dbTool.getMataData();
                    if (!mataData.directoryIndex) {
                        await dbTool.updateMateData();
                        mataData = await dbTool.getMataData();
                    }
                    await dbTool.close();
                    fileInfoList.push({ id: i, fileName, filePath, size, sizeFormat, mataData });
                }
            }
            return fileInfoList;
        };
        static createDB = async function (DBName, targetDirectory, mataData = {}, log = false) {
            await configTool_js_1.default.init();
            let targetDirectoryInfo = await index_js_1.default.getPathInfo(targetDirectory);
            let hasDB = await DBTool.HasDB(DBName);
            let mes;
            if (hasDB) {
                mes = `失败，该目录下已有同名资源库：${targetDirectory}`;
            }
            else if (targetDirectoryInfo && targetDirectoryInfo.isDirectory) {
                let dbTool = new DBTool(DBName);
                await dbTool.connect();
                let pg = new ProgressBar_js_1.default('创建资源库', 40);
                await dbTool.packFile(targetDirectory, '', function (e) {
                    e.action = 'runProgress';
                    log && pg.render(e);
                    webSocketTool_js_1.default.send(JSON.stringify(e));
                });
                await dbTool.setMataData(mataData);
                webSocketTool_js_1.default.send(JSON.stringify({
                    description: '创建资源库完成', completed: 2, total: 2, action: 'runProgress'
                }));
                await dbTool.close();
                mes = '创建资源库成功';
            }
            else {
                mes = '映射目录是无效目录';
            }
            return mes;
        };
        static appendFile = async function (DBName, targetDirectory, currentDirectory, log = false) {
            await configTool_js_1.default.init();
            let targetDirectoryInfo = await index_js_1.default.getPathInfo(targetDirectory);
            let mes;
            if (targetDirectoryInfo && targetDirectoryInfo.isDirectory) {
                let dbTool = new DBTool(DBName);
                await dbTool.connect();
                let pg = new ProgressBar_js_1.default('追加文件', 40);
                await dbTool.packFile(targetDirectory, currentDirectory, function (e) {
                    e.action = 'runProgress';
                    log && pg.render(e);
                    webSocketTool_js_1.default.send(JSON.stringify(e));
                });
                webSocketTool_js_1.default.send(JSON.stringify({
                    description: '追加文件', completed: 2, total: 2, action: 'runProgress'
                }));
                await dbTool.close();
                mes = '创建资源库成功';
            }
            else {
                mes = `失败，该目录下已有同名资源库：${targetDirectory}`;
            }
            return mes;
        };
        static exportDB = async function (DBName, targetDirectory, log = false) {
            await configTool_js_1.default.init();
            let targetDirectoryInfo = await index_js_1.default.getPathInfo(targetDirectory);
            let mes;
            if (targetDirectoryInfo && targetDirectoryInfo.isDirectory) {
                let dbTool = new DBTool(DBName);
                let pg = new ProgressBar_js_1.default('导出资源库', 40);
                await dbTool.exportFile(targetDirectory, function (e) {
                    e.action = 'runProgress';
                    log && pg.render(e);
                    webSocketTool_js_1.default.send(JSON.stringify(e));
                });
                webSocketTool_js_1.default.send(JSON.stringify({
                    description: '导出资源库完成', completed: 1, total: 1, action: 'runProgress'
                }));
                await dbTool.close();
                mes = '导出资源成功';
            }
            else {
                mes = `失败，该映射目录错误：${targetDirectory}`;
            }
            return mes;
        };
        static deleteDB = async function (DBName) {
            await configTool_js_1.default.init();
            return index_js_1.default.deleteFile(path_1.default.join(configTool_js_1.default.appBasePath, `/temp/fileDB`, DBName + '.sqlite3'));
        };
        async connect() {
            if (this?.sqlite3Promise?.db) {
                return 'Open';
            }
            await configTool_js_1.default.init();
            let filePathList = await DBTool.getDBPathList();
            this.filePath = filePathList.find((p) => p.indexOf(this.dbName + '.sqlite3') > -1);
            if (this.filePath) {
                this.sqlite3Promise = this.sqlite3Promise || new Sqlite3Promise_js_1.default(this.filePath);
                await this.sqlite3Promise.open();
                await this.sqlite3Promise.exec(schema_js_1.default);
                return 'Connect';
            }
            else {
                this.filePath = configTool_js_1.default.appBasePath + '/temp/fileDB/' + this.dbName + '.sqlite3';
                this.sqlite3Promise = this.sqlite3Promise || new Sqlite3Promise_js_1.default(this.filePath);
                await this.sqlite3Promise.open();
                await this.sqlite3Promise.exec(schema_js_1.default);
                return 'Create';
            }
        }
        ;
        async getFolderList() {
            let that = this;
            await that.connect();
            let folderList = await this.sqlite3Promise.all('select distinct file_path from file_info', null);
            folderList = folderList.map((item) => item.file_path);
            let pathSet = new Set();
            for (let i = 0; i < folderList.length; i++) {
                index_js_1.default.pathSplit(folderList[i]).forEach((item) => {
                    pathSet.add(item);
                });
            }
            folderList = [...pathSet];
            return folderList;
        }
        async getFolderInfoList() {
            let that = this;
            await that.connect();
            let folderInfoList = [];
            let mataDate = await that.getMataData();
            let directoryIndex = mataDate?.directoryIndex;
            if (directoryIndex) {
                try {
                    folderInfoList = JSON.parse(directoryIndex);
                    return folderInfoList;
                }
                catch (e) {
                }
            }
            let folderList = await that.getFolderList();
            let realtimePathMet = new Map();
            for (let i = 0; i < folderList.length; i++) {
                realtimePathMet.set(folderList[i], { path: folderList[i], file_count: 0, total_size: 0 });
            }
            let currentPathInfoList = await this.sqlite3Promise.all('SELECT file_path,count( file_size ) AS file_count,sum( file_size ) AS total_size FROM file_info GROUP BY file_path', null);
            for (let i = 0; i < currentPathInfoList.length; i++) {
                index_js_1.default.pathSplit(currentPathInfoList[i].file_path).forEach((item) => {
                    realtimePathMet.get(item).file_count += currentPathInfoList[i].file_count;
                    realtimePathMet.get(item).total_size += currentPathInfoList[i].total_size;
                });
            }
            for (const [key] of realtimePathMet) {
                folderInfoList.push(realtimePathMet.get(key));
            }
            return folderInfoList;
        }
        ;
        async getDBPathTree() {
            let that = this;
            await that.connect();
            let pathInfoList = await that.getFolderInfoList();
            const treeDTO = [];
            pathInfoList.forEach(({ path, file_count, total_size }) => {
                const nodeArray = path.split('\\');
                let children = treeDTO;
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
        }
        ;
        async getDirListByPath(dirPath) {
            let that = this;
            await that.connect();
            let pathInfoList = await that.getFolderInfoList();
            let itemFolder = [];
            let set = new Set();
            let matchPathItem = dirPath.split('\\').filter(p => p !== '');
            pathInfoList.forEach(({ path, file_count, total_size }) => {
                let sourcePathItem = path.split('\\').filter((p) => p !== '');
                let matchArr = sourcePathItem.slice(0, matchPathItem.length);
                if (JSON.stringify(matchPathItem) === JSON.stringify(matchArr)) {
                    let pathItem = path.replace(dirPath, '').split('\\').filter((p) => p !== '');
                    let childPath = pathItem[0];
                    if (childPath && !set.has(childPath)) {
                        set.add(childPath);
                        itemFolder.push({
                            ext: 'directory', file_name: childPath, file_path: dirPath + childPath + '\\'
                        });
                    }
                }
            });
            let fileList = await that.getFileListByPath(dirPath);
            for (let i = 0; i < fileList.length; i++) {
                fileList[i].ext = path_1.default.extname(fileList[i].file_name);
            }
            return [...itemFolder, ...fileList];
        }
        ;
        async packFile(targetDirectory, currentDirectory, progressFunc) {
            let that = this;
            await that.connect();
            let filePathList = await index_js_1.default.getFilePathList(targetDirectory);
            let unitObject = {};
            unitObject.count = filePathList.length;
            unitObject.index = 0;
            unitObject.progressFunc = progressFunc;
            unitObject.beginTime = new Date().getTime();
            let chunkSize = Math.ceil(filePathList.length / 100);
            chunkSize = chunkSize < 2000 ? chunkSize : 2000;
            let filePathChunk = (0, arrChunk_js_1.default)(filePathList, chunkSize);
            let fileBufferSize = 0;
            let miniFilePathList = [];
            let largeFilePathList = [];
            while (filePathChunk.length > 0) {
                let filePathChunkList = filePathChunk.shift();
                let fileInfoList = await index_js_1.default.getFileInfoList({
                    filePathList: filePathChunkList, rootPath: targetDirectory
                });
                fileInfoList.map((fileInfo) => {
                    fileInfo.relativePath = path_1.default.join(currentDirectory || '', fileInfo.relativePath);
                    return fileInfo;
                });
                for (let j = 0; j < fileInfoList.length; j++) {
                    fileBufferSize += fileInfoList[j].size / 1024;
                    if (fileInfoList[j].size < 1024 * 8) {
                        miniFilePathList.push(fileInfoList[j]);
                    }
                    else {
                        largeFilePathList.push(fileInfoList[j]);
                    }
                }
                if (miniFilePathList.length > 1_0000) {
                    await that.insertData(miniFilePathList, unitObject, 'mini');
                    fileBufferSize = 0;
                    miniFilePathList = [];
                }
                if (fileBufferSize > 50 || largeFilePathList.length > 5000) {
                    await that.insertData(largeFilePathList, unitObject, 'large');
                    fileBufferSize = 0;
                    largeFilePathList = [];
                }
            }
            await that.insertData(miniFilePathList, unitObject, 'mini');
            await that.insertData(largeFilePathList, unitObject, 'large');
            await that.updateMateData();
            await that.close();
        }
        ;
        async insertData(completeInfoList, option = null, insertType = 'large', transaction = true) {
            let that = this;
            await that.connect();
            let fileInfoSql = 'INSERT OR IGNORE INTO file_info  (file_name, file_path, file_zip, file_size, file_md5) VALUES ';
            let fileInfoSqlSum = fileInfoSql;
            let fileDataSql = 'INSERT OR IGNORE INTO file_data (file_md5, file_data) VALUES ';
            let fileDataSqlSum = fileDataSql;
            let ProgressNumber = 82;
            let reportProgress = 0;
            transaction && await this.sqlite3Promise.beginTransaction();
            while (completeInfoList.length > 0) {
                let fileItem = completeInfoList.pop();
                let buffer = fileItem.buffer;
                let file_path = path_1.default.dirname(fileItem.relativePath);
                file_path = file_path === '\\' ? '\\' : file_path + '\\';
                if (completeInfoList.length === 0 || fileInfoSqlSum.length > 1024 * 1024 * 250) {
                    fileInfoSqlSum += `('${fileItem.fileName}', '${file_path}', '${fileItem.compressType}', ${fileItem.size}, '${fileItem.md5}'),`;
                    await this.sqlite3Promise.insertData(fileInfoSqlSum.substring(0, fileInfoSqlSum.length - 1), []);
                    fileInfoSqlSum = fileInfoSql;
                }
                else {
                    fileInfoSqlSum += `('${fileItem.fileName}', '${file_path}', '${fileItem.compressType}', ${fileItem.size}, '${fileItem.md5}'),`;
                }
                if (insertType === 'mini') {
                    if (completeInfoList.length === 0 || fileDataSqlSum.length > 1024 * 1024 * 250) {
                        fileDataSqlSum += `('${fileItem.md5}', X'${buffer.toString('hex')}'),`;
                        await this.sqlite3Promise.insertData(fileDataSqlSum.substring(0, fileDataSqlSum.length - 1), []);
                        fileDataSqlSum = fileDataSql;
                    }
                    else {
                        fileDataSqlSum += `('${fileItem.md5}', X'${buffer.toString('hex')}'),`;
                    }
                }
                else if (insertType === 'large') {
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
        }
        ;
        async deleteByDir(dir) {
            let that = this;
            await that.connect();
            dir = dir.replaceAll('/', '\\');
            dir = `${dir}%`;
            const [err, res] = await (0, awaitWrap_js_1.default)(this.sqlite3Promise.run('delete from file_info where file_path like ?', [dir]));
            await that.updateMateData();
            return res;
        }
        ;
        async deleteByFullPath(fullPath) {
            let that = this;
            await that.connect();
            let fileName = path_1.default.basename(fullPath);
            let filePath = fullPath.replaceAll(fileName, '');
            filePath = filePath.replaceAll('/', '\\');
            const [err, res] = await (0, awaitWrap_js_1.default)(this.sqlite3Promise.run('delete from file_info where file_path = ? and file_name = ?', [filePath, fileName]));
            await that.updateMateData();
            return res;
        }
        ;
        async clearFileDate() {
            let that = this;
            await that.connect();
            console.time('清除悬空的文件数据');
            await (0, awaitWrap_js_1.default)(this.sqlite3Promise.run('delete from file_data where file_md5 in (SELECT file_data.file_md5 FROM file_data,file_deleted WHERE file_data.file_md5 = file_deleted.file_md5)'));
            console.timeEnd('清除悬空的文件数据');
        }
        async wipeCache() {
            let that = this;
            await that.connect();
            console.time('释放存储空间');
            await (0, awaitWrap_js_1.default)(this.sqlite3Promise.run('VACUUM', null));
            console.timeEnd('释放存储空间');
            return true;
        }
        ;
        async exportFile(path, progressFunc) {
            let that = this;
            let beginTime = new Date().getTime();
            await that.connect();
            let [{ count }] = await this.sqlite3Promise.all('select max(file_gid) as count from file_list', null);
            let index = 0;
            let pageCount = Math.ceil(count / 5000);
            for (let i = 0; i < pageCount; i++) {
                let list = await this.sqlite3Promise.all('select * from file_list WHERE ?<=file_gid and file_gid<? limit 5000', [i * 5000, (i + 1) * 5000]);
                let pList = [];
                while (list.length > 0) {
                    let fileItem = list.pop();
                    index++;
                    pList.push(new Promise(async (resolve) => {
                        let fileData = fileItem.file_zip === 'gzip' ? await zlibPromise_js_1.default.unzip(fileItem.file_data) : fileItem.file_data;
                        await index_js_1.default.createFileAsync((path || `${configTool_js_1.default.appBasePath}/OutFile`) + `/${this.dbName}${fileItem.file_full_path}`, fileData);
                        typeof progressFunc === 'function' && progressFunc({
                            description: '文件导出',
                            completed: index,
                            total: count,
                            passTime: Math.ceil((new Date().getTime() - beginTime) / 1000)
                        });
                        resolve(null);
                    }));
                    if (list.length === 0) {
                        await Promise.all(pList);
                        pList = [];
                    }
                }
                await Promise.all(pList);
            }
        }
        ;
        async getFileListByPath(path) {
            let that = this;
            await that.connect();
            return await this.sqlite3Promise.all('select *  from file_info where file_path = ?', [path]);
        }
        ;
        async getDirInfo(dirPath) {
            let that = this;
            await that.connect();
            let pathInfoList = await that.getFolderInfoList();
            let dirInfo = pathInfoList.find((item) => item.path === dirPath);
            let count = dirInfo?.file_count || 0;
            let totalSize = dirInfo?.total_size || 0;
            if (totalSize < 1024) {
                totalSize = totalSize + 'b';
            }
            else if (totalSize < 1024 * 1024) {
                totalSize = (totalSize / 1024).toFixed(2) + 'Kb';
            }
            else if (totalSize < 1024 * 1024 * 1024) {
                totalSize = (totalSize / 1024 / 1024).toFixed(2) + 'MB';
            }
            else if (totalSize < 1024 * 1024 * 1024 * 1024) {
                totalSize = (totalSize / 1024 / 1024 / 1024).toFixed(2) + 'GB';
            }
            return {
                childFileCount: count, childFileTotalSize: totalSize
            };
        }
        ;
        async getMataData() {
            await this.connect();
            let attrList = await this.sqlite3Promise.all('select * from metadata', null);
            let mataData = {};
            attrList.forEach((e) => mataData[e.name] = e.value);
            return mataData;
        }
        ;
        async setMataData(mataData = {}) {
            let that = this;
            await that.connect();
            for (const name in mataData) {
                let value1 = mataData[name];
                await this.sqlite3Promise.insertData('INSERT OR IGNORE INTO metadata (name, value) VALUES ( ?, ?)', [name, value1]);
                let value2 = mataData[name];
                await this.sqlite3Promise.run('update metadata set value = ? where name = ?', [value2, name]);
            }
            return '修改元数据成功';
        }
        ;
        async updateMateData() {
            let that = this;
            await this.connect();
            let folderInfo = await that.getFolderInfoList();
            let mataData = await that.getMataData();
            mataData.fileCount = folderInfo.find((item) => item.path === '\\')?.file_count || 0;
            mataData.totalSize = folderInfo.find((item) => item.path === '\\')?.total_size || 0;
            mataData.directoryIndex = JSON.stringify(folderInfo);
            mataData.updateTime = index_js_2.default.DateTool.ISODateString(new Date());
            await that.setMataData(mataData);
        }
        async getFileListBySearch(text) {
            let that = this;
            await that.connect();
            return await this.sqlite3Promise.all(`select *
             from file_info
             where file_name like '%${text}%'
                OR file_path like '%${text}%' LIMIT 200`, null);
        }
        ;
        async getFileByFullPath(fullPath = '', unzip = true) {
            let that = this;
            await that.connect();
            let fileName = path_1.default.basename(fullPath);
            let filePath = path_1.default.dirname(fullPath).replaceAll('/', '\\');
            filePath = filePath.endsWith('\\') ? filePath : filePath + '\\';
            const [err, list] = await (0, awaitWrap_js_1.default)(this.sqlite3Promise.all('select * from file_list where file_name = ? and file_path = ?', [fileName, filePath]));
            let file;
            if (err || list.length === 0) {
                file = null;
            }
            else {
                file = list.pop();
                file.file_data = unzip && file.file_zip === 'gzip' ? await zlibPromise_js_1.default.unzip(file.file_data) : file.file_data;
            }
            return file;
        }
        ;
        async getFileByMd5(MD5 = '', unzip = true) {
            let that = this;
            await that.connect();
            const [err, list] = await (0, awaitWrap_js_1.default)(this.sqlite3Promise.all('select *  from file_list where file_md5 = ?', [MD5]));
            let file;
            if (err || list.length === 0) {
                file = null;
            }
            else {
                file = list.pop();
                file.file_data = unzip && file.file_zip === 'gzip' ? await zlibPromise_js_1.default.unzip(file.file_data) : file.file_data;
            }
            return file;
        }
        ;
        async close() {
            await this.sqlite3Promise.close();
        }
        ;
    }
    return DBTool;
});
//# sourceMappingURL=DBTool.js.map