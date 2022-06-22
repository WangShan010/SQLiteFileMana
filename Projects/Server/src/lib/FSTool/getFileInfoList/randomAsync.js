// 单进程计算 文件数组 的 MD5
const calcFileInfo = require('../calcFileInfo.js');

async function randomAsync({filePathList, progressFunc, rootPath}) {
    // 最终运行成果，先准备一个空数值
    let md5List = [];
    // 全部需要运算的【文件路径列表】长度
    let allFileListCount = filePathList.length;
    let ProgressNumber = Math.floor(allFileListCount / 50) < 1 ? 1 : Math.floor(allFileListCount / 50);
    let reportProgress = 0;    // 避免过度频繁的通信

    let psMap = new Map();
    while (filePathList.length > 0) {
        let filePath = filePathList.pop();

        psMap.set(filePath, new Promise(async (resolve) => {
            let fileInfo = await calcFileInfo(filePath, rootPath);
            if (fileInfo) {
                md5List.push(fileInfo);
            }
            psMap.delete(filePath);
            resolve();
        }));
        if (psMap.size === 10) {
            await Promise.race(Array.from(psMap.values()));
        } else if (filePathList.length === 0) {
            await Promise.all(Array.from(psMap.values()));
        }

        reportProgress++;
        if (reportProgress === ProgressNumber) {
            reportProgress = 0;
            typeof progressFunc === 'function' && progressFunc({
                description: '【扫描 MD5】',
                completed: allFileListCount - filePathList.length,
                total: allFileListCount
            });
        }
    }

    typeof progressFunc === 'function' && progressFunc(
        {description: '【扫描 MD5】', completed: allFileListCount, total: allFileListCount}
    );

    return md5List;
}

module.exports = randomAsync;
