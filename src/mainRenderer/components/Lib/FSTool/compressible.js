// 可压缩
const path = require("path");

// 判断文件是否适合进行压缩，
function compressible(filePath) {
    let ext = path.extname(filePath).toLowerCase();
    let boolean = true; // 可压缩

    let fileExtList = [
        ".png",
        ".jpg",
        ".jpeg",
        ".zip",
        ".rar",
    ];

    fileExtList.forEach(e => e === ext && (boolean = false));

    return boolean;
}

module.exports = compressible;
