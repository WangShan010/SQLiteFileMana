const fs = require('fs');

/**
 * 创建空文件夹
 * 注意：理解末尾要带上：【\】
 * @param path
 */
function createDirectory(path: string) {
    const dirCache = {} as any;
    const arr = path.replace(/\\/g, '/').split('/');
    let dir = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (!dirCache[dir] && !fs.existsSync(dir)) {
            dirCache[dir] = true;
            fs.mkdirSync(dir);
        }
        dir = dir + '/' + arr[i];
    }
}

// 示例
// createDirectory('H:\\30天临时\\临时文件\\')

export = createDirectory;
