const fs = require('fs');
const zlibPromise = require('./zlibPromise.js');
const calcFileInfo = require('./calcFileInfo.js');
const createFile = require('./createFile.js');
const createFileAsync = require('./createFileAsync.js');
const deleteFile = require('./deleteFile.js');
const getFilePathList = require('./getFilePathList.js');
const getPathInfo = require('./getPathInfo.js');
const getFileInfoList = require('./getFileInfoList/index.js');
const compressible = require('./compressible.js');
const pathSplit = require('./pathSplit.js');
const readFileAsync = require('./readFileAsync.js');

const Index = {
    zlibPromise: zlibPromise,
    calcFileInfo: calcFileInfo,
    compressible: compressible,
    deleteFile,
    getPathInfo,
    getFilePathList,
    getFileInfoList,
    createFile,
    createFileAsync,
    pathSplit,

    // 异步读取文件
    readFileAsync,
    // 同步读取文件
    readFileSync: fs.readFileSync,
    writeFileSync: fs.writeFileSync
};

export = Index;
