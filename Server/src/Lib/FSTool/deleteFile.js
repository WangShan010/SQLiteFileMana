const fs = require('fs');

// 删除文件
function deleteFile(path) {
    try {
        fs.unlinkSync(path);
    } catch (e) {
        // console.warn('文件删除失败', path);
    }
}

// 示例
// deleteFile('H:\\30天临时\\1.txt')

module.exports = deleteFile;
