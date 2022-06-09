const fs = require('fs');
const compressible = require('./compressible.js');
const zlibPromise = require('./gzip.js');

// 封装了 fs 读取文件的函数
async function readFile(path) {
    return new Promise(function (resolve) {
        fs.readFile(path, function (error, date) {
            if (error) {
                // console.log(error);
            }
            resolve(error ? Buffer.from('') : date);
        });
    });
}

/**
 * 计算文件信息
 * @param fullPath      文件所在位置的绝对路径
 * @param rootPath      基础路径
 * @param compress      是否进行压缩
 */
async function calcFileInfo(fullPath, rootPath = '', compress = true) {
    let relativePath = fullPath.replace(rootPath, '');
    let fileName = fullPath.split('\\').slice(-1)[0];
    let buffer = await readFile(fullPath);
    let compressType = '';

    if (compress && compressible(fullPath)) {
        buffer = await zlibPromise.zip(buffer);
        compressType = 'gzip';
    }

    let md5 = require('crypto').createHash('md5').update(buffer).digest('hex');
    let size = buffer.length;

    let fileObj = {
        fullPath,           // 文件绝对路径
        relativePath,       // 文件相对路径
        fileName,           // 文件名
        buffer,             // 文件内容
        compressType,       // 压缩类型
        md5,                // 文件 MD5
        size                // 文件大小
    };


    return fileObj;
}


module.exports = calcFileInfo;
