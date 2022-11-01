const fs = require('fs');

// 删除文件
function deleteFile(path: string) {
    let result = true;
    try {
        fs.unlinkSync(path);
    } catch (e) {
        result = false;
        console.warn('文件删除失败', path);
    }
    return result;
}


export = deleteFile;
