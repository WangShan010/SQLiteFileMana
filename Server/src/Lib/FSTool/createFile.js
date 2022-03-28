const fs = require('fs');
const path = require('path');
const createDirectory = require('./createDirectory.js');


// 创建文件
function createFile(filePath, data) {
    let dirPath = path.dirname(filePath) + '\\';

    createDirectory(dirPath);
    if (fs.existsSync(filePath)) {
        // console.warn('文件已存在');
    } else {
        fs.writeFileSync(filePath, data);
    }
}

// 示例
// createFile('D:\\VGEServer\\vge-software-resources\\jiaxing\\DOM\\0\\test.txt', 'sssss');

module.exports = createFile;
