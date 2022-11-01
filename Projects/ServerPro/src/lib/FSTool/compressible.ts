// 可压缩
const path = require('path');

// 判断文件是否适合进行压缩，
function compressible(filePath: string) {
    let ext = path.extname(filePath).toLowerCase();
    let boolean = true; // 可压缩

    // 不可压缩的文件类型
    let fileExtList = [
        '.png',
        '.jpg',
        '.jpeg',
        '.zip',
        '.rar',
        '.mp3',
        '.mp4',
        '.avi',
        '.gif'
    ];

    fileExtList.forEach(e => e === ext && (boolean = false));

    return boolean;
}

export = compressible;
