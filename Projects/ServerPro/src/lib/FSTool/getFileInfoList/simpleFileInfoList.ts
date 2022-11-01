// 单进程计算 文件数组 的 MD5
const calcFileInfo = require('../calcFileInfo.js');

async function simpleFileInfoList(filePathList: string[], progressFunc: Function, rootPath: string) {
    // 最终运行成果，先准备一个空数值
    let md5List = [];
    // 全部需要运算的【文件路径列表】长度
    let allFileListCount = filePathList.length;
    let ProgressNumber = Math.floor(allFileListCount / 50) < 1 ? 1 : Math.floor(allFileListCount / 50);
    let reportProgress = 0;    // 避免过度频繁的通信

    // 根据 Buffer 计算 MD5 值
    for (let i = 0; i < allFileListCount; i++) {
        let filePath = filePathList.pop();
        let fileInfo = await calcFileInfo(filePath, rootPath);
        md5List.push(fileInfo);

        reportProgress++;
        if (reportProgress === ProgressNumber) {
            reportProgress = 0;
            typeof progressFunc === 'function' && progressFunc({
                description: '【扫描 MD5】',
                completed: i,
                total: allFileListCount
            });
        }
    }
    typeof progressFunc === 'function' && progressFunc(
        {description: '【扫描 MD5】', completed: allFileListCount, total: allFileListCount}
    );

    return md5List;
}

export = simpleFileInfoList;
