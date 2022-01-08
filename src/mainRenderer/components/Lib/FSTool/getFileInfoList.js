/**
 *
 *
 * 有普通两种模式：
 *     （一）simple        模式，当文件数量小于 3000 个，单线程模式，逐个计算读取，最后一次性返回全部数据
 *
 *     （二）phased        模式，需要扫描的文件总大小超过 4GB，
 *      程序中设定一个内存的最大使用率，使得函数分批返回。
 *
 *     （二）fourThread    模式，当文件数量过多时，开启 4 个进程，同时进行读取与计算。
 *     线程将文件读取并计算后暂存在缓存目录下，主进程再进行读取，并清除缓存文件
 */


const {simpleFileInfoList, phasedFileInfoList, fourThreadFileInfoList} = require('../../Utils/MD5/md5.js');

/**
 * 传入一组 【文件绝对路径】的数组，把全部文件的 Buffer 都读取出来，同时计算出其 MD5等信息
 * @param fileList                      文件的绝对路径字符串，数组
 * @param mode                          运行模式
 * @param phasedFunc                    可不填，回调函数性能优化选项，传入一个函数
 * @param progressFunc                  可不填，回调函数性能优化选项，传入一个函数
 * @param option                        可不填，其他参数
 * @returns {Promise<*[]>}
 */
async function getFileInfoList({fileList, mode, phasedFunc, progressFunc, basePath}) {
    // 初始化化参数
    fileList = fileList || [];
    mode = mode || 'phased';
    phasedFunc = phasedFunc || null;
    progressFunc = progressFunc || null;
    basePath = basePath || '';


    let fileInfoList = [];
    switch (mode) {
        case 'simple':
            fileInfoList = await simpleFileInfoList({fileList, progressFunc, basePath});
            break;
        case 'phased':
            fileInfoList = await phasedFileInfoList({fileList, phasedFunc, progressFunc, basePath});
            break;
        case 'fourThread':
            fileInfoList = await fourThreadFileInfoList({fileList, phasedFunc, progressFunc, basePath});
    }
    return fileInfoList;
}


module.exports = getFileInfoList;
