const fs = require('fs');
const path = require('path');
const createDirectory = require('./createDirectory.js');


// 创建文件
async function createFileAsync(filePath, data) {
    let dirPath = path.dirname(filePath) + '\\';

    createDirectory(dirPath);

    if (fs.existsSync(filePath)) {
        // 文件已存在
        return false;
    } else {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, data, (err) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }
}

module.exports = createFileAsync;
