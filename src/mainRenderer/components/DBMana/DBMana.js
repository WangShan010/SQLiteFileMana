/****************************************************************************
 名称：资源库管理工具
 作者：超神洋葱
 描述：管理可用的资源库
 最后修改日期：2021-12-05
 ****************************************************************************/
const FSTool = require('../Lib/FSTool/FSTool.js');
const DBTool = require('./DBTool/DBTool.js');
const webSocketTool = require('../WebServer/webSocketTool/webSocketTool.js');
const Path = require('path');
let DBMana = {};

const fileType = {
    cpp: 'cpp',
    css: 'css',
    doc: 'doc',
    docx: 'docx',
    exe: 'exe',
    html: 'html',
    jpg: 'jpg',
    js: 'js',
    md: 'md',
    mp3: 'mp3',
    mp4: 'mp4',
    pages: 'pages',
    pdf: 'pdf',
    png: 'png',
    py: 'py',
    rar: 'rar',
    txt: 'txt',
    wav: 'wav',
    xls: 'xls',
    xml: 'xml',
    zip: 'zip',
    file: 'file'
};


// 获取资源库列表
DBMana.getDBList = async function () {
    let filePathList = await FSTool.getFileList(FSTool.basePath + '\\MapDB');

    let fileInfoList = [];

    for (let i = 0; i < filePathList.length; i++) {
        let path = filePathList[i];
        let fileName = path.split('\\').slice(-1)[0].split('.')[0];
        let extName = Path.extname(path);
        let info = await FSTool.getPathInfo(path, false);
        let size = info.size;
        let sizeFormat = null;

        if (size < 1000) {
            sizeFormat = size + 'KB';
        } else if (size < 1000000) {
            sizeFormat = (size / 1000).toFixed(2) + 'MB';
        } else if (size < 1000000000) {
            sizeFormat = (size / 1000000).toFixed(2) + 'GB';
        }

        extName === '.sqlite3' && fileInfoList.push({id: i, fileName, path, size, sizeFormat});
    }

    return fileInfoList;
};

/**
 * 创建资源库
 * @param targetDirectory 映射目录
 * @param DBName 资源库名称
 * @returns {Promise < boolean >}
 */
DBMana.createDB = async function (DBName, targetDirectory) {
    // 映射目录 的信息
    let targetDirectoryInfo = await FSTool.getPathInfo(targetDirectory);

    // 资源库 信息
    let DBFilePath = `${FSTool.basePath}\\MapDB\\${DBName}.sqlite3`;
    let DBFileInfo = await FSTool.getPathInfo(DBFilePath);
    let res = false;

    // 该映射目录是有效文件夹，并且目录下没有同名 sqlite3 文件
    if (targetDirectoryInfo && targetDirectoryInfo.isDirectory && DBFileInfo === null) {


        let dbToll = new DBTool(DBName);
        await dbToll.init();
        await dbToll.packFile(targetDirectory, function (e) {
            e.action = 'runProgress';
            // 发生进度信息
            webSocketTool.send(JSON.stringify(e));
        });
        webSocketTool.send(JSON.stringify({description: '创建资源库完成', completed: 2, total: 2, action: 'runProgress'}));
        res = true;
    }

    console.log(DBFileInfo, DBFilePath);
    return res;
};

// 导出资源库
DBMana.exportDB = async function (DBName, targetDirectory) {
    // 映射目录 的信息
    let targetDirectoryInfo = await FSTool.getPathInfo(targetDirectory);

    // 资源库 信息
    let DBFilePath = `${targetDirectory}\\${DBName}.sqlite3`;
    let res = false;

    // 该映射目录是有效文件夹，并且目录下没有同名 sqlite3 文件
    if (targetDirectoryInfo && targetDirectoryInfo.isDirectory) {
        let dbToll = new DBTool(DBName);
        await dbToll.init();
        await dbToll.exportFile(targetDirectory, function (e) {
            e.action = 'runProgress';
            // 发生进度信息
            webSocketTool.send(JSON.stringify(e));
        });
        webSocketTool.send(JSON.stringify({description: '导出资源库完成', completed: 1, total: 1, action: 'runProgress'}));
        res = true;
    }
    return res;
};

// 获取目录结构
DBMana.getDBPathTree = async function (DBName) {
    let dbToll = new DBTool(DBName);
    let pathList = await dbToll.getPathList();
    const treeDTO = [];
    pathList.forEach(item => {
        const nodeArray = item.split('\\');
        let children = treeDTO;
        // 循环构建子节点
        for (const i of nodeArray) {
            const node = {
                label: i
            };
            if (children.length === 0) {
                children.push(node);
            }
            let isExist = false;
            for (const j in children) {
                if (children[j].label === node.label) {
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

    treeDTO[0].label = DBName;

    return treeDTO;
};

// 打开路径
DBMana.getFileListByPath = async function (DBName, path) {
    let dbToll = new DBTool(DBName);
    // 获取全部 文件夹 列表
    let pathList = await dbToll.getPathList();


    // 构造文件夹对象
    let itemFolder = [];
    let set = new Set();
    let matchPathItem = path.split('\\').filter(p => p !== '');


    pathList.forEach(p => {
        let sourcePathItem = p.split('\\').filter(p => p !== '');
        let matchArr = sourcePathItem.slice(0, matchPathItem.length);
        if (JSON.stringify(matchPathItem) === JSON.stringify(matchArr)) {
            let pathItem = p.replace(path, '').split('\\').filter(p => p !== '');
            let childPath = pathItem[0];
            if (childPath && !set.has(childPath)) {
                set.add(childPath);
                itemFolder.push({
                    ext: 'directory',
                    file_name: childPath,
                    file_path_location: path + childPath + '\\'
                });
            }
        }
    });


    // 获取 文件 列表
    let fileList = await dbToll.getFileListByPath(path);
    for (let i = 0; i < fileList.length; i++) {
        fileList[i].ext = fileType[Path.extname(fileList[i].file_name).toLowerCase().replace('.', '')] || fileType.file;
    }


    return [...itemFolder, ...fileList];
};

// 读取文件
DBMana.getFileByFullPath = async function (DBName, path) {
    let dbToll = new DBTool(DBName);
    let fileList = await dbToll.getFileByFullPath(path);
    let file = fileList.pop();
    let fileData = file.file_zip === 'gzip' ? await zlibPromise.unzip(file.file_data) : file.file_data;

    return fileData;
};

// 读取文件
DBMana.getFileByMd5 = async function (DBName, MD5) {
    let dbToll = new DBTool(DBName);
    let fileList = await dbToll.getFileByMd5(MD5);
    return fileList.pop();
};


// DBMana.getFileListByPath('MapTile-google', '\\0\\0\\0.png').then(e => console.log(e));
// DBMana.getFileByFullPath('MapTile-google', '\\3\\7\\4.png').then(e => console.log(e));
// DBMana.createDB('设施','D:\\GisFileMana\\FileResources\\MapTile-google')
// DBMana.getDBPathTree('MapTile-google').then(e => console.log(e));
// DBMana.getFileByMd5('MapTile-google', '69e4fb43d28bf4e9e874a9d90330237a').then(e => console.log(e));
// DBMana.getFileByFullPath('MapTile-google', '\\3\\7\\4.png').then(e => console.log(e));
// DBMana.exportDB('MapTile-google', 'C:\\Users\\23948\\Desktop\\30天临时文件夹').then(e => console.log(e));


module.exports = DBMana;
