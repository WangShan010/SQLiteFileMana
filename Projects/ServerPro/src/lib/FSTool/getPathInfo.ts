import ErrnoException = NodeJS.ErrnoException;
import {Stats} from 'fs';

const fs = require('fs');

// 获取文件信息：【大小、是否为文件夹、md5】
async function getPathInfo(path: string, calcMd5 = true) {
    return new Promise(function (resolve) {
        fs.stat(path, (err: ErrnoException, stats: Stats) => {
            let info = null;
            if (err) {
            } else {
                info = {
                    isDirectory: !!stats && stats.isDirectory(),
                    size: stats.size / 1000,
                    md5: null
                };

                if (calcMd5 && !info.isDirectory) {
                    info.md5 = require('crypto').createHash('md5').update(fs.readFileSync(path)).digest('hex');
                }
            }
            resolve(info);
        });
    });
}


export = getPathInfo;
