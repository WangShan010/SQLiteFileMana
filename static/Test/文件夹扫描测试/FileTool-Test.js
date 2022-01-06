const FSTool = require('../../../src/mainRenderer/components/Utils/FSTool.js');

// 应用基本路径，例如：D:\SQLiteFileMana
const basePath = FSTool.basePath;

async function test01() {
    const dirPath = basePath + '\\FileResources\\MapTile-google';

    const fileList = await FSTool.getFileList(dirPath);

    console.log(Buffer.from(JSON.stringify(fileList)).length / 1024 / 1024, 'MB');
}

// 方案一、最简单的单线程计算文件信息
async function test02() {
    const dirPath = basePath + '\\FileResources\\MapTile-google';

    const fileList = await FSTool.getFileList(dirPath);
    const fileInfoList = await FSTool.getFileInfoList({fileList, mode: 'simple', basePath});

    console.log(fileList.length, fileInfoList);
}

// 方案二：单线程、内存设阈值的 计算文件信息，避免进程的内存占用量过高
async function test03() {
    const dirPath = basePath + '\\FileResources\\DEM-wordHeights\\8';

    const fileList = await FSTool.getFileList(dirPath);
    let fileInfoList = [];

    await FSTool.getFileInfoList({
        fileList,
        mode: 'phased',
        phasedFunc: function (list) {
            while (list.length > 0) fileInfoList.push(list.pop());
        },
        basePath
    });


    console.log(fileInfoList);
}

// 方案三：四线程计算文件信息
async function test04() {
    const dirPath = basePath + '\\FileResources\\DEM-wordHeights\\5';

    const fileList = await FSTool.getFileList(dirPath);
    let fileInfoList = [];

    await FSTool.getFileInfoList({
        fileList,
        mode: 'fourThread',
        // phasedFunc: function (list) {
        //     console.log(list);
        //     while (list.length > 0) fileInfoList.push(list.pop());
        // },
        progressFunc: function (e) {
            console.log(e);
        },
        basePath
    });

    console.log(fileInfoList);
}

console.time('运行耗时');
test04().then(e => {
    console.timeEnd('运行耗时');
});
