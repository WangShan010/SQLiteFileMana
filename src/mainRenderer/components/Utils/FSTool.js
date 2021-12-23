const fs = require('fs');
const path = require('path');
const {fdir} = require('fdir');
const {phasedFileInfoList, fourThreadFileInfoList} = require('./MD5/md5.js');

const rootPath = path.join(__dirname, '../'.repeat(50));
const basePath = path.join(rootPath, './SQLiteFileMana');
const dirCache = {};

/***
 * 获取目录下全部子文件列表，fdir 速度无与伦比。它可以在不到1秒的时间内轻松检索包含一百万个文件的目录！
 * @param parentPath    子文件夹的绝对路径
 */
async function getFileList(parentPath) {
    const api = new fdir().withFullPaths().crawl(parentPath);
    return await api.withPromise();
}


/**
 * 传入一组 【文件绝对路径】的数组，把全部的文件的 Buffer 都读取出来，同时计算出其 MD5等信息
 *
 * 有普通两种模式：
 *     （一）当文件数量小于 4000 个时，单线程模式，逐个计算读取，最后一次性返回全部数据
 *     （二）当文件数量过多时，开启 4 个进程，同时进行读取与计算。
 *      例子：
 *      let fileInfoList = await FSTool.getFileInfoList([
 *          'D:\\SQLiteFileMana\\FileResources\\DEM-wordHeights\\4\\-1\\0.terrain',
 *          'D:\\SQLiteFileMana\\FileResources\\DEM-wordHeights\\4\\-1\\1.terrain'
 *      ],
 *      'D:\\SQLiteFileMana\\FileResources\\DEM-wordHeights'
 *      );
 *
 * 大数据量模式：
 * 在项目应用中，可能问题会更加复杂，例如：
 *      可能需要扫描的文件数量超过 20万 个，并且总文件存储量超过 10GB。这种极端情况下会导致运行程序
 *   的内存占用率狂飙而最终超出负载（99%）。
 *      借鉴超市的库存、进货、销售，动态体系思想。程序中设定一个内存的最大使用率，使得函数分批返回。
 *      经大量测试优化：主进程最多可以存储 100MB ，子进程最多存储 25MB 的文件数据。
 *
 *      超过此阈值，自动调用 phasedFunc 回调函数，将本批次的成果数据弹出。
 *      例子：
 *
 *      let fileInfoList = [];
 *      await FSTool.getFileInfoList([
 *          'D:\\SQLiteFileMana\\FileResources\\DEM-wordHeights\\4\\-1\\0.terrain',
 *          'D:\\SQLiteFileMana\\FileResources\\DEM-wordHeights\\4\\-1\\1.terrain',
 *       ...],
 *      'D:\\SQLiteFileMana\\FileResources\\DEM-wordHeights',
 *      phasedList => {
 *           while (phasedList.length > 0) fileInfoList.push(phasedList.pop());
 *          }
 *      )
 *
 * @param fullPathList      路径数组
 * @param phasedFunc        可不填， 回调函数性能优化选项，传入一个函数
 * @param option
 * @returns {Promise<*[]>}
 */
async function getFileInfoList(fullPathList, phasedFunc, option, progressFunc) {
    return await phasedFileInfoList(fullPathList, phasedFunc, option, progressFunc);
}

// 获取文件信息：【大小、是否为文件夹、md5】
async function getPathInfo(path, calcMd5 = true) {
    return new Promise(function (resolve) {
        fs.stat(path, (err, stats) => {
            let info = null;
            if (err) {
            } else {
                info = {isDirectory: !!stats && stats.isDirectory()};
                info.size = stats.size / 1000;
                calcMd5 && !info.isDirectory && (info.md5 = require('crypto').createHash('md5').update(fs.readFileSync(path)).digest('hex'));
            }
            resolve(info);
        });
    });
}

// 创建文件
async function createFile(filePath, data) {
    return new Promise(function (resolve, reject) {
        if (fs.existsSync(filePath)) {
        } else {
            mkdir(filePath);
        }

        fs.appendFile(filePath, data, 'utf8', function (err) {
            err && resolve(false);
            resolve(true);
        });
    });
}

// 创建空文件夹
async function createDirectory(path) {
    const dirCache = {};
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

function mkdir(filePath) {
    filePath = filePath.replace(/\\/g, '/');

    const arr = filePath.split('/');
    let dir = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (!dirCache[dir] && !fs.existsSync(dir)) {
            dirCache[dir] = true;
            fs.mkdirSync(dir);
        }
        dir = dir + '/' + arr[i];
    }
    fs.writeFileSync(filePath, '');
}

(async function init() {
    await createFile(basePath + '/日志.txt', '初始化成功\n');
    await createDirectory(basePath + '/FileResources/');
    await createDirectory(basePath + '/MapDB/');
    await createDirectory(basePath + '/OutFile/');
})();

const FSTool = {
    basePath,
    getPathInfo,
    getFileList,
    getFileInfoList,
    createFile,
    readFileSync: fs.readFileSync
};

module.exports = FSTool;
