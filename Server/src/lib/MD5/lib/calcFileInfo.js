const fs = require('fs');

// 计算文件信息
async function calcFileInfo(path, basePath) {
    let filePath = path;
    let fileName = filePath.split('\\').slice(-1)[0];
    let buffer = await readFile(filePath);
    let fullPath = filePath;
    let md5 = require('crypto').createHash('md5').update(buffer).digest('hex');
    let relativePath = fullPath.replace(basePath, '');
    let size = buffer.length >> 10;
    return {fileName, fullPath, relativePath, buffer, md5, size}
}


// 封装了 fs 读取文件的函数
async function readFile(path) {
    return new Promise(function(resolve) {
        fs.readFile(path, function(error, date) {
            //读取文件，回调函数第一个参数表示错误信息，第二个参数为读取的文本内容
            if (error) {
                // console.log(error);
            }
            resolve(error ?  Buffer.from('') : date);
        });
    });
}

module.exports = calcFileInfo
