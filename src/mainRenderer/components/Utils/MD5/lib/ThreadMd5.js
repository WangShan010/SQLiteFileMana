const calcFileInfo = require('./calcFileInfo.js')
/**
 * 子进程，用于计算文件的 MD5 值
 *
 * threadName 进程名称，标识符
 * threadPathList   一组文件的绝对路径数组
 * basePath     这些文件的基础路径
 * maxMemory  内存上限
 */
process.on('message',
    async function ({threadName, threadPathList, basePath, maxMemory}) {
        // 最终运行成果，先准备一个空数值
        let md5List = [];

        // 每计算出 ProgressNumber 个文件的详细信息，就向主进程汇报一次进度
        let ProgressNumber = 50;    // 避免过度频繁的 主进程-子进程 通信
        let reportProgress = 0;     // 计数标识符
        let bufferTotal = 0;        // 累积使用的，内存计数
        let count = threadPathList.length;  // 全部需要运算的【文件路径列表】长度

        // 根据 Buffer 计算 MD5 值
        for (let i = 0; i < count; i++) {
            let filePath = threadPathList[i]
            let fileInfo = await calcFileInfo(filePath, basePath)
            md5List.push(fileInfo);


            // 向主进程汇报进度，并重新开始计数
            reportProgress++;
            if (reportProgress === ProgressNumber) {
                reportProgress = 0;
                process.send({message: 'Progress', data: ProgressNumber});
            }

            // 超出内存了，把当前这部分的数据弹出进程。
            bufferTotal += fileInfo.size;
            if (typeof maxMemory === 'number' && bufferTotal > maxMemory) {
                bufferTotal = 0;
                process.send({message: 'Phased', data: md5List});
                // 释放内存
                md5List = [];
            }
        }
        // 补足向主进程汇报一次进度到 100 %
        process.send({message: 'Progress', data: reportProgress});

        //弹出剩余的数据，并结束子进程
        process.send({message: 'RemainsData', data: md5List});

        // 释放内存
        threadPathList = [];
        md5List = [];
    }
);

