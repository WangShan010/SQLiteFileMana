const fs = require('fs');
const cp = require('child_process');
const sqlite3Promise = require('../../DBMana/DBTool/sqlite3-promise.js');
const App = require('../FSTool/AppTool.js');

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

// 开启 4 个进程来并行计算 文件数组 的 MD5
async function fourThreadFileInfoList({fileList, phasedFunc, progressFunc, basePath}) {
    // 最终运行成果，先准备一个空数值
    let md5List = [];

    let optionObj = {
        basePath,
        index: 0,
        progressLength: fileList.length
    };

    // 开启多线程解析文件列表，将解析成果暂时放入 缓存文件中
    let [batch1, batch2, batch3, batch4] = group(fileList, 4);
    await Promise.all([
        creatThread('线程1', batch1, progressFunc, optionObj),
        creatThread('线程2', batch2, progressFunc, optionObj),
        creatThread('线程3', batch3, progressFunc, optionObj),
        creatThread('线程4', batch4, progressFunc, optionObj),
    ]);

    md5List = await readThreadCache(App.basePath + '/Cache/线程1.db');
    console.log(md5List.length);
    // md5List.concat(await readThreadCache(App.basePath + '/Cache/线程2.db'));
    // md5List.concat(await readThreadCache(App.basePath + '/Cache/线程3.db'));
    // md5List.concat(await readThreadCache(App.basePath + '/Cache/线程4.db'));

    return md5List;
}


// 创建计算 MD5 的进程
function creatThread(threadName, threadPathList, progressFunc, optionObj = {}) {
    return new Promise(function (resolve) {
        // 创建子进程
        let n = cp.fork(__dirname + '/lib/threadMd5.js');

        // 向子进程发送数据
        n.send({threadName, threadPathList, basePath: optionObj.basePath});

        n.on('message', function (reData) {
            let message = reData.message;
            switch (message) {
                case 'Progress': {
                    optionObj.index += reData.data;
                    typeof progressFunc === 'function' && progressFunc(
                        {description: '【开启 4 进程扫描 MD5】', completed: optionObj.index, total: optionObj.progressLength}
                    );
                }
                    break;
                case 'Complete': {
                    resolve('Complete');
                    n.disconnect();
                }
            }
        });
    });
}

// 读取线程缓存数据
async function readThreadCache(path) {
    await sqlite3Promise.open(path);
    const list = await sqlite3Promise.all('select * from cache');
    await sqlite3Promise.close();
    return list;
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


module.exports = {
    simpleFileInfoList,
    phasedFileInfoList,
    fourThreadFileInfoList,
    fileMd5,
    stringMd5
};

