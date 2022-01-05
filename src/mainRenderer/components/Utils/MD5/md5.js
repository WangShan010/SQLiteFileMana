const fs = require('fs');
let cp = require('child_process');

const calcFileInfo = require('./lib/calcFileInfo.js');

// 单进程计算 文件数组 的 MD5
async function simpleFileInfoList({fileList, progressFunc, basePath}) {
    // 最终运行成果，先准备一个空数值
    let md5List = [];
    // 全部需要运算的【文件路径列表】长度
    let allFileListCount = fileList.length;

    // 根据 Buffer 计算 MD5 值
    for (let i = 0; i < allFileListCount; i++) {
        let filePath = fileList.pop();
        let fileInfo = await calcFileInfo(filePath, basePath);
        md5List.push(fileInfo);

        typeof progressFunc === 'function' && progressFunc({description: '【扫描 MD5】', completed: i, total: allFileListCount});
    }
    return md5List;
}

// 单线程、内存设阈值的 计算文件数组 信息，避免进程的内存占用量过高
async function phasedFileInfoList({fileList, phasedFunc, progressFunc, basePath}) {
    let mainMaxMemory = 100 << 10;      // 主进程最大的内存限制 ，默认 100MB
    let mainBufferTotal = 0;            // 当前主进程的内存占用量

    let allFileListCount = fileList.length; // 总进度
    let index = 0;                      // 当前进度
    let ProgressNumber = 50;    // 避免过度频繁的通信
    let reportProgress = 0;     // 计数标识符

    // 最终运行成果，先准备一个空数值
    let md5List = [];

    // 根据 Buffer 计算 MD5 值
    while (fileList.length > 0) {
        let filePath = fileList.pop();
        let fileInfo = await calcFileInfo(filePath, basePath);
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

// 开启 4 个进程来计算 文件数组 的 MD5
async function fourThreadFileInfoList({fileList, phasedFunc, progressFunc, basePath}) {
    let coreNum = 4;
    let mainMaxMemory = 128 << 10;      // 主进程最大的内存限制 ，默认 128MB
    let mainBufferTotal = 0;            // 当前主进程的内存占用量
    let threadMaxMemory = 32 << 10;     // 子进程最大的内存限制 ，默认 32MB

    let allFileCount = fileList.length; // 总进度
    let index = 0;                      // 当前进度
    let md5List = [];                   // 最终成果

    // 创建计算 MD5 的进程
    function creatThread(threadName, threadPathList) {
        return new Promise(function (resolve) {
            // 创建子进程
            let n = cp.fork(__dirname + '/lib/threadMd5.js');

            // 向子进程发送数据
            n.send({threadName, threadPathList, basePath, maxMemory: threadMaxMemory});

            n.on('message', function (reData) {
                let message = reData.message;
                switch (message) {
                    case 'Progress': {
                        index += reData.data;
                        typeof progressFunc === 'function' && progressFunc(
                            {description: '【开启 4 进程扫描 MD5】', completed: index, total: allFileCount}
                        );
                    }
                        break;
                    case 'Phased': {
                        while (reData.data.length) {
                            let f = reData.data.pop();
                            f.buffer = Buffer.from(f.buffer.data);
                            mainBufferTotal += f.size;
                            md5List.push(f);
                        }

                        // 超出最大内存了，就把当前这部分的数据弹出进程。
                        if (typeof phasedFunc === 'function' && mainBufferTotal > mainMaxMemory) {
                            mainBufferTotal = 0;
                            phasedFunc(md5List);
                            // 释放内存
                            md5List.length = 0;
                        }
                    }
                        break;
                    case 'RemainsData': {
                        while (reData.data.length) {
                            let f = reData.data.pop();
                            f.buffer = Buffer.from(f.buffer.data);
                            mainBufferTotal += f.size;
                            md5List.push(f);
                        }

                        if (typeof phasedFunc === 'function') {
                            phasedFunc(md5List);
                            // 释放内存
                            md5List.length = 0;
                        }

                        resolve('End');
                        n.disconnect();
                    }
                }
            });

        });
    }

    // 把总任务，平分给每一个字进程
    let batchFileList = group(fileList, coreNum);

    // 创建进程
    let threadList = [];
    for (let i = 0; i < coreNum; i++) {
        let thread = creatThread(String(i), batchFileList[i]);
        threadList.push(thread);
    }
    fileList.length = 0;
    batchFileList.length = 0;

    // 等待全部的进程完成工作
    await Promise.all(threadList);

    return md5List;
}

// 计算文件的 MD5 值
async function fileMd5(path) {
    const buffer = fs.readFileSync(path);
    return require('crypto').createHash('md5').update(buffer).digest('hex');
}

// 计算字符串的 MD5
async function stringMd5(str) {
    return require('crypto').createHash('md5').update(Buffer.from(str)).digest('hex');
}

// 数组切分为每 subNum 个一组
function groupSimple(array, subNum) {
    let result = [];
    for (let i = 0; i < array.length; i += subNum) {
        result.push(array.slice(i, i + subNum));
    }
    return result;
}


// 把完整数组分成 coreNum 份，数组平分
function group(array, subNum) {
    let part = (array.length / subNum) + 1;
    let newArray = [];
    for (let i = 0; i < subNum; i++) {
        newArray.push(array.slice(i * part, (i + 1) * part));
    }

    return newArray;
}

// 封装了 fs 读取文件二进制数据的函数
async function readFile(path) {
    return new Promise(function (resolve) {
        fs.readFile(path, function (error, date) {
            //读取文件，回调函数第一个参数表示错误信息，第二个参数为读取的文本内容
            if (error) {
                console.log(error);
            }
            resolve(error ? Buffer.from('') : date);
        });
    });
}


module.exports = {
    simpleFileInfoList,
    phasedFileInfoList,
    fourThreadFileInfoList,
    fileMd5,
    stringMd5
};

