const fs = require('fs');

// 获取文件信息：【大小、是否为文件夹、md5】
async function getPathInfo(path, calcMd5 = true) {
    return new Promise(function (resolve) {
        fs.stat(path, (err, stats) => {
            let info = null;
            if (err) {
            } else {
                info = {isDirectory: !!stats && stats.isDirectory()};
                info.size = stats.size / 1000;
                calcMd5 && !info.isDirectory && (info.md5 = require('crypto').createHash('md5').update(fs.readFileSync(path)).digest('hex'));
            }
            resolve(info);
        });
    });
}


module.exports = getPathInfo;
