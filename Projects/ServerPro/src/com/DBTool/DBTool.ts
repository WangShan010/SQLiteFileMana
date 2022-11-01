import path from 'path';
import configTool from '../configTool.js';
import Sqlite3Promise from './Sqlite3Promise.js';
import FSTool from '../../lib/FSTool/index.js';
import zlibPromise from '../../lib/FSTool/zlibPromise.js';
import awaitWrap from '../../lib/awaitWrap.js';
import webSocketTool from '../webSocketTool/webSocketTool.js';
import arrChunk from '../../lib/arrChunk.js';
import schema from './schema.js';
import ProgressBar from '../../lib/ProgressBar/ProgressBar.js';
import YaoDo from '../../lib/YaoDo/index.js';

class DBTool {
    public dbName: string = '';
    public filePath: string = '';
    public sqlite3Promise: any;

    constructor(name: string) {
        let that = this;
        that.dbName = name;
        that.filePath = '';
    }

    // 判断该数据库是否存在
    static HasDB = async function (DBName: string) {
        await configTool.init();
        let filePathList = await DBTool.getDBPathList();
        return filePathList.some((item: string) => DBName + '.sqlite3' === path.basename(item));
    };
    // 获取资源库的路径列表
    static getDBPathList = async function () {
        return await FSTool.getFilePathList(path.join(configTool.appBasePath, `/temp/fileDB`));
    };
    // 获取资源库列表
    static getDBInfoList = async function () {
        await configTool.init();
        let filePathList = await DBTool.getDBPathList();

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
                if (!mataData.directoryIndex) {
                    await dbTool.updateMateData();
                    mataData = await dbTool.getMataData();
                }

                await dbTool.close();
                fileInfoList.push({id: i, fileName, filePath, size, sizeFormat, mataData});
            }
        }

        return fileInfoList;
    };
    // 创建资源库
    static createDB = async function (DBName: string, targetDirectory: string, mataData = {}, log = false) {
        await configTool.init();
        // 获取映射目录 的信息
        let targetDirectoryInfo = await FSTool.getPathInfo(targetDirectory);
        let hasDB = await DBTool.HasDB(DBName);

        // 资源库 信息
        let mes;
        if (hasDB) {
            mes = `失败，该目录下已有同名资源库：${targetDirectory}`;
        } else if (targetDirectoryInfo && targetDirectoryInfo.isDirectory) {
            // 该映射目录是有效文件夹，并且目录下没有同名 sqlite3 文件
            let dbTool = new DBTool(DBName);
            await dbTool.connect();
            let pg = new ProgressBar('创建资源库', 40);
            await dbTool.packFile(targetDirectory, '', function (e: any) {
                e.action = 'runProgress';
                log && pg.render(e);
                // 发生进度信息
                webSocketTool.send(JSON.stringify(e));
            });
            await dbTool.setMataData(mataData);
            webSocketTool.send(JSON.stringify({
                description: '创建资源库完成', completed: 2, total: 2, action: 'runProgress'
            }));
            await dbTool.close();
            mes = '创建资源库成功';
        } else {
            mes = '映射目录是无效目录';
        }

        return mes;
    };
    // 追加文件
    static appendFile = async function (DBName: string, targetDirectory: string, currentDirectory: string, log = false) {
        await configTool.init();
        // 获取映射目录 的信息
        let targetDirectoryInfo = await FSTool.getPathInfo(targetDirectory);

        // 资源库 信息
        let mes;

        if (targetDirectoryInfo && targetDirectoryInfo.isDirectory) {
            let dbTool = new DBTool(DBName);
            await dbTool.connect();
            let pg = new ProgressBar('追加文件', 40);
            await dbTool.packFile(targetDirectory, currentDirectory, function (e: any) {
                e.action = 'runProgress';
                log && pg.render(e);
                // 发生进度信息
                webSocketTool.send(JSON.stringify(e));
            });
            webSocketTool.send(JSON.stringify({
                description: '追加文件', completed: 2, total: 2, action: 'runProgress'
            }));
            await dbTool.close();
            mes = '创建资源库成功';
        } else {
            mes = `失败，该目录下已有同名资源库：${targetDirectory}`;
        }

        return mes;

    };
    // 导出资源库
    static exportDB = async function (DBName: string, targetDirectory: string, log = false) {
        await configTool.init();
        // 映射目录 的信息
        let targetDirectoryInfo = await FSTool.getPathInfo(targetDirectory);

        let mes;
        // 该映射目录是有效文件夹，并且目录下没有同名 sqlite3 文件
        if (targetDirectoryInfo && targetDirectoryInfo.isDirectory) {
            let dbTool = new DBTool(DBName);
            let pg = new ProgressBar('导出资源库', 40);
            await dbTool.exportFile(targetDirectory, function (e: any) {
                e.action = 'runProgress';
                log && pg.render(e);
                // 发生进度信息
                webSocketTool.send(JSON.stringify(e));
            });
            webSocketTool.send(JSON.stringify({
                description: '导出资源库完成', completed: 1, total: 1, action: 'runProgress'
            }));
            await dbTool.close();
            mes = '导出资源成功';
        } else {
            mes = `失败，该映射目录错误：${targetDirectory}`;
        }
        return mes;
    };
    // 删除数据库
    static deleteDB = async function (DBName: string) {
        await configTool.init();
        return FSTool.deleteFile(path.join(configTool.appBasePath, `/temp/fileDB`, DBName + '.sqlite3'));
    };

    // 打开数据库连接
    async connect() {
        if (this?.sqlite3Promise?.db) {
            return 'Open';
        }
        await configTool.init();
        let filePathList = await DBTool.getDBPathList();

        this.filePath = filePathList.find((p: string) => p.indexOf(this.dbName + '.sqlite3') > -1);

        // 已存在资源库文件
        if (this.filePath) {
            this.sqlite3Promise = this.sqlite3Promise || new Sqlite3Promise(this.filePath);
            await this.sqlite3Promise.open();
            await this.sqlite3Promise.exec(schema);

            return 'Connect';
        } else {
            // 不存在资源库文件，则新建一个
            this.filePath = configTool.appBasePath + '/temp/fileDB/' + this.dbName + '.sqlite3';
            this.sqlite3Promise = this.sqlite3Promise || new Sqlite3Promise(this.filePath);
            await this.sqlite3Promise.open();
            await this.sqlite3Promise.exec(schema);
            return 'Create';
        }
    };

    // 获取全部文件夹列表
    async getFolderList() {
        let that = this;
        await that.connect();
        let folderList = await this.sqlite3Promise.all('select distinct file_path from file_info', null);
        folderList = folderList.map((item: any) => item.file_path);

        let pathSet = new Set();
        for (let i = 0; i < folderList.length; i++) {
            FSTool.pathSplit(folderList[i]).forEach((item: any) => {
                pathSet.add(item);
            });
        }

        folderList = [...pathSet];

        return folderList;
    }

    // 对全部文件夹，进行扫描统计
    async getFolderInfoList() {
        let that = this;
        await that.connect();
        let folderInfoList = [];


        let mataDate = await that.getMataData();
        let directoryIndex = mataDate?.directoryIndex;

        // 目录索引存在
        if (directoryIndex) {
            try {
                // 目录索引存在，直接合法
                folderInfoList = JSON.parse(directoryIndex);
                return folderInfoList;
            } catch (e) {
                // 数据库中的目录索引数据不合法，重新扫描
            }
        }

        // 全部文件夹
        let folderList = await that.getFolderList();

        // 对文件夹信息对象进行数组装箱
        let realtimePathMet = new Map();
        for (let i = 0; i < folderList.length; i++) {
            realtimePathMet.set(folderList[i], {path: folderList[i], file_count: 0, total_size: 0});
        }

        // 各文件夹路径下，实体文件数量、总大小=========》【不统计子文件夹】
        let currentPathInfoList = await this.sqlite3Promise.all('SELECT file_path,count( file_size ) AS file_count,sum( file_size ) AS total_size FROM file_info GROUP BY file_path', null);
        for (let i = 0; i < currentPathInfoList.length; i++) {
            FSTool.pathSplit(currentPathInfoList[i].file_path).forEach((item: any) => {
                realtimePathMet.get(item).file_count += currentPathInfoList[i].file_count;
                realtimePathMet.get(item).total_size += currentPathInfoList[i].total_size;
            });
        }


        for (const [key] of realtimePathMet) {
            folderInfoList.push(realtimePathMet.get(key));
        }

        return folderInfoList;
    };

    // 将文件夹组织为树形结构
    async getDBPathTree() {
        let that = this;
        await that.connect();
        let pathInfoList = await that.getFolderInfoList();
        const treeDTO: any[] = [];
        pathInfoList.forEach(({path, file_count, total_size}: any) => {
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
    async getDirListByPath(dirPath: string) {
        let that = this;
        await that.connect();
        // 获取全部 文件夹 列表

        let pathInfoList = await that.getFolderInfoList();

        // 构造文件夹对象
        let itemFolder: any[] = [];
        let set = new Set();
        let matchPathItem = dirPath.split('\\').filter(p => p !== '');

        pathInfoList.forEach(({path, file_count, total_size}: any) => {
            let sourcePathItem = path.split('\\').filter((p: string) => p !== '');
            let matchArr = sourcePathItem.slice(0, matchPathItem.length);
            if (JSON.stringify(matchPathItem) === JSON.stringify(matchArr)) {
                let pathItem = path.replace(dirPath, '').split('\\').filter((p: string) => p !== '');
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
    async packFile(targetDirectory: string, currentDirectory: string, progressFunc: Function) {
        let that = this;

        await that.connect();
        let filePathList = await FSTool.getFilePathList(targetDirectory);

        let unitObject: any = {};
        unitObject.count = filePathList.length;
        unitObject.index = 0;
        unitObject.progressFunc = progressFunc;
        unitObject.beginTime = new Date().getTime();
        let chunkSize = Math.ceil(filePathList.length / 100);
        chunkSize = chunkSize < 2000 ? chunkSize : 2000;

        let filePathChunk = arrChunk(filePathList, chunkSize);

        let fileBufferSize = 0;
        let miniFilePathList = [];        // 小文件（1~8kb）列表
        let largeFilePathList = [];       // 大文件（>8kb）列表

        while (filePathChunk.length > 0) {
            let filePathChunkList = filePathChunk.shift();
            let fileInfoList = await FSTool.getFileInfoList({
                filePathList: filePathChunkList, rootPath: targetDirectory
            });

            fileInfoList.map((fileInfo: any) => {
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

        await that.updateMateData();
        await that.close();
    };

    async insertData(completeInfoList: any[], option: any = null, insertType = 'large', transaction = true) {
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

            let file_path = path.dirname(fileItem.relativePath);
            file_path = file_path === '\\' ? '\\' : file_path + '\\';

            if (completeInfoList.length === 0 || fileInfoSqlSum.length > 1024 * 1024 * 250) {

                fileInfoSqlSum += `('${fileItem.fileName}', '${file_path}', '${fileItem.compressType}', ${fileItem.size}, '${fileItem.md5}'),`;

                await this.sqlite3Promise.insertData(fileInfoSqlSum.substring(0, fileInfoSqlSum.length - 1), []);
                fileInfoSqlSum = fileInfoSql;
            } else {
                fileInfoSqlSum += `('${fileItem.fileName}', '${file_path}', '${fileItem.compressType}', ${fileItem.size}, '${fileItem.md5}'),`;
            }


            if (insertType === 'mini') {
                if (completeInfoList.length === 0 || fileDataSqlSum.length > 1024 * 1024 * 250) {
                    fileDataSqlSum += `('${fileItem.md5}', X'${buffer.toString('hex')}'),`;

                    await this.sqlite3Promise.insertData(fileDataSqlSum.substring(0, fileDataSqlSum.length - 1), []);
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

    async deleteByDir(dir: string) {
        let that = this;
        await that.connect();
        dir = dir.replaceAll('/', '\\');
        dir = `${dir}%`;
        const [err, res] = await awaitWrap(this.sqlite3Promise.run('delete from file_info where file_path like ?', [dir]));

        await that.updateMateData();
        return res;
    };

    async deleteByFullPath(fullPath: string) {
        let that = this;
        await that.connect();
        let fileName = path.basename(fullPath);
        let filePath = fullPath.replaceAll(fileName, '');
        filePath = filePath.replaceAll('/', '\\');
        const [err, res] = await awaitWrap(this.sqlite3Promise.run('delete from file_info where file_path = ? and file_name = ?', [filePath, fileName]));

        await that.updateMateData();
        return res;
    };

    // 清除悬空的文件数据，即在文件数据
    async clearFileDate() {
        let that = this;
        await that.connect();
        console.time('清除悬空的文件数据');
        await awaitWrap(this.sqlite3Promise.run('delete from file_data where file_md5 in (SELECT file_data.file_md5 FROM file_data,file_deleted WHERE file_data.file_md5 = file_deleted.file_md5)'));
        console.timeEnd('清除悬空的文件数据');
    }

    // 释放缓存空间，Sqlite 数据库有一个特性，就是当删除掉一些记录后数据库的体积也不会缩小，需要我们手动去释放存储空间。
    async wipeCache() {
        let that = this;
        await that.connect();
        console.time('释放存储空间');
        await awaitWrap(this.sqlite3Promise.run('VACUUM', null));
        console.timeEnd('释放存储空间');
        return true;
    };

    async exportFile(path: string, progressFunc: Function) {
        let that = this;
        let beginTime = new Date().getTime();
        await that.connect();

        let [{count}] = await this.sqlite3Promise.all('select max(file_gid) as count from file_list', null);
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
    };

    // 根据目录获取文件
    async getFileListByPath(path: string) {
        let that = this;
        await that.connect();
        return await this.sqlite3Promise.all('select *  from file_info where file_path = ?', [path]);
    };

    // 根据文件夹路径，获取文件夹详情，dirPath：'\\12\\'
    async getDirInfo(dirPath: string) {
        let that = this;
        await that.connect();

        let pathInfoList = await that.getFolderInfoList();
        let dirInfo = pathInfoList.find((item: any) => item.path === dirPath);
        let count = dirInfo?.file_count || 0;
        let totalSize = dirInfo?.total_size || 0;

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

    async getMataData() {
        await this.connect();
        let attrList: any[] = await this.sqlite3Promise.all('select * from metadata', null);
        let mataData: any = {};
        attrList.forEach((e: any) => mataData[e.name] = e.value);

        return mataData;
    };

    async setMataData(mataData: any = {}) {
        let that = this;
        await that.connect();
        for (const name in mataData) {
            let value1 = mataData[name];
            await this.sqlite3Promise.insertData('INSERT OR IGNORE INTO metadata (name, value) VALUES ( ?, ?)', [name, value1]);
            let value2 = mataData[name];
            await this.sqlite3Promise.run('update metadata set value = ? where name = ?', [value2, name]);
        }
        return '修改元数据成功';
    };

    async updateMateData() {
        let that = this;
        await this.connect();

        let folderInfo = await that.getFolderInfoList();

        let mataData = await that.getMataData();
        mataData.fileCount = folderInfo.find((item: any) => item.path === '\\')?.file_count || 0;
        mataData.totalSize = folderInfo.find((item: any) => item.path === '\\')?.total_size || 0;
        mataData.directoryIndex = JSON.stringify(folderInfo);
        mataData.updateTime = YaoDo.DateTool.ISODateString(new Date());
        await that.setMataData(mataData);
    }

    // 搜索文件
    async getFileListBySearch(text: string) {
        let that = this;
        await that.connect();
        return await this.sqlite3Promise.all(
            `select *
             from file_info
             where file_name like '%${text}%'
                OR file_path like '%${text}%' LIMIT 200`,
            null);
    };

    // 读取文件
    // 参数示例：\0\0\0.png
    async getFileByFullPath(fullPath = '', unzip = true) {
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
    async getFileByMd5(MD5 = '', unzip = true) {
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


    // 断开数据库连接
    async close() {
        await this.sqlite3Promise.close();
    };
}


export = DBTool;
