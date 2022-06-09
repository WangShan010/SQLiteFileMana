import fs from 'fs';

// 计算文件的 MD5 值
async function fileMd5(path) {
    const buffer = fs.readFileSync(path);
    return require('crypto').createHash('md5').update(buffer).digest('hex');
}

module.exports = fileMd5;
