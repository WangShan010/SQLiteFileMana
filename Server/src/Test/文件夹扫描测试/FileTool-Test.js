const configTool = require('../../lib/configTool.js');
const FSTool = require('../../Lib/FSTool/index.js');

// 应用基本路径，例如：D:\SQLiteFileMana
const basePath = configTool.appBasePath;

async function test01() {
    const dirPath = basePath + '\\FileResources\\MapTile-google';

    const fileList = await FSTool.getFileList(dirPath);

    console.log(Buffer.from(JSON.stringify(fileList)).length / 1024 / 1024, 'MB');
}

// 131,584 个文件，耗时：【31s，30s，30s】
// 方案一、最简单的单线程计算文件信息，
async function test02() {
    const dirPath = basePath + '\\FileResources\\DEM-wordHeights\\8';

    const fileList = await FSTool.getFileList(dirPath);
    const fileInfoList = await FSTool.getFileInfoList({
        fileList, mode: 'simple', basePath, progressFunc: function (e) {
            console.log(e, Math.floor(e.completed / e.total * 100));
        }
    });

    console.log(fileInfoList.length);
}

// 131,584 个文件，耗时：【19s，18s，18s】
// 方案二：单线程、内存设阈值的 计算文件信息，避免进程的内存占用量过高
async function test03() {
    const dirPath = basePath + '\\FileResources\\DEM-wordHeights\\8';

    const fileList = await FSTool.getFileList(dirPath);
    let fileInfoList = [];

    await FSTool.getFileInfoList({
        fileList,
        mode: 'phased',
        progressFunc: function (e) {
            console.log(e, Math.floor(e.completed / e.total * 100));
        },
        phasedFunc: function (list) {
            while (list.length > 0) fileInfoList.push(list.pop());
        },
        basePath
    });


    console.log(fileInfoList.length);
}

// 131,584 个文件，耗时：【11s，11s，10s】
// 525,312 个文件，耗时：【90s】
// 方案三：四线程计算文件信息
async function test04() {
    const dirPath = 'D:\\VGEServer\\vge-software-resources\\jiaxing\\DOM';

    const fileList = await FSTool.getFileList(dirPath);
    const fileInfoList = await FSTool.getFileInfoList({
        fileList,
        mode: 'fourThread',
        progressFunc: function (e) {
            console.log(e, Math.floor(e.completed / e.total * 100));
        },
        basePath
    });

    console.log(fileInfoList.length);
}

console.time('运行耗时');
test04().then(e => {
    console.timeEnd('运行耗时');
});
