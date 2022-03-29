const fs = require('fs');
const zlibPromise = require('./gzip.js');
const createFile = require('./createFile.js');
const deleteFile = require('./deleteFile.js');
const getFileList = require('./getFileList.js');
const getPathInfo = require('./getPathInfo.js');
const getFileInfoList = require('./getFileInfoList.js');
const compressible = require('./compressible.js');

const Index = {
    zlibPromise: zlibPromise,
    compressible: compressible,
    deleteFile,
    getPathInfo,
    getFileList,
    getFileInfoList,
    createFile,
    // 同步读取文件
    readFileSync: fs.readFileSync
};

module.exports = Index;
