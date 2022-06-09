// 单线程、内存设阈值的 计算文件数组 信息，避免进程的内存占用量过高
const calcFileInfo = require('../calcFileInfo.js');

async function phasedFileInfoList({filePathList, phasedFunc, progressFunc, rootPath}) {
    let mainMaxMemory = 100 << 10;      // 主进程最大的内存限制 ，默认 100MB
    let mainBufferTotal = 0;            // 当前主进程的内存占用量

    let allFileListCount = filePathList.length; // 总进度
    let index = 0;                      // 当前进度
    let ProgressNumber = Math.floor(allFileListCount / 25) < 1 ? 1 : Math.floor(allFileListCount / 25);    // 避免过度频繁的通信
    let reportProgress = 0;     // 计数标识符

    // 最终运行成果，先准备一个空数值
    let md5List = [];

    // 根据 Buffer 计算 MD5 值
    while (filePathList.length > 0) {
        let filePath = filePathList.pop();
        let fileInfo = await calcFileInfo(filePath, rootPath);
        md5List.push(fileInfo);

        mainBufferTotal += fileInfo.size;

        // 向主进程汇报进度，并重新开始计数
        index++;
        reportProgress++;
        if (reportProgress === ProgressNumber) {
            reportProgress = 0;
            typeof progressFunc === 'function' && progressFunc(
                {description: '【单线程、100MB 内存设阈值，扫描 MD5】', completed: index, total: allFileListCount}
            );
        }

        if (mainBufferTotal > mainMaxMemory && typeof phasedFunc === 'function') {
            mainBufferTotal = 0;
            await phasedFunc(md5List);
            md5List.length = 0;
        }
    }

    typeof progressFunc === 'function' && progressFunc(
        {description: '【单线程、100MB 内存设阈值，扫描 MD5】', completed: index, total: allFileListCount}
    );


    if (typeof phasedFunc === 'function') {
        await phasedFunc(md5List);
        md5List.length = 0;
    }

    return md5List;
}

module.exports = phasedFileInfoList;
