const path = require('path');
let FSTool = require('../../src/mainRenderer/components/Utils/FSTool.js');
let {fourThreadFileInfoList} = require('../../src/mainRenderer/components/Utils/MD5/md5.js');

async function test01() {
    let basePath = 'D:\\SQLiteFileMana\\FileResources\\MapTile-google';
    let p = path.join(basePath);

    let fileList = await FSTool.getFileList(p);
    let fileInfoList = [];

    // 方案一、最简单的单线程计算文件信息
    // fileInfoList = await FSTool.getFileInfoList(fileList, null, {basePath});

    // 方案二：单线程、内存设阈值的 计算文件数组 信息，避免进程的内存占用量过高
    await FSTool.getFileInfoList(fileList, phasedList => {
            while (phasedList.length > 0) fileInfoList.push(phasedList.pop());
        }, {basePath}
    );


    console.log(fileInfoList);
}


async function test02() {
    console.time('test02');
    let basePath = 'H:\\SQLiteFileMana\\FileResources\\DEM-wordHeights\\9';

    // let dInfo = await FSTool.getPathInfo(basePath);     //获取文件信息
    let fileList = await FSTool.getFileList(basePath);     //获取文件信息

    // let fileInfo = await FSTool.getFileInfoList(fileList);

    let fileInfo = await fourThreadFileInfoList(fileList);
    console.log(fileInfo.length);
    console.timeEnd('test02');
}



// test02();
