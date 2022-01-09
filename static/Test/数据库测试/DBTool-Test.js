let DBTool = require('../../../src/mainRenderer/components/DBMana/DBTool/DBTool.js');


// 测试打包 23GB 瓦片文件，耗时：12:09
async function main01() {
    let DBName = 'DOM';

    console.time('打包');
    let dbTool = new DBTool(DBName);
    await dbTool.init();
    await dbTool.packFile('D:\\VGEServer\\vge-software-resources\\jiaxing\\DOM', function (e) {
        console.log(e);
    });
    console.timeEnd('打包');
}

// 测试打包 280W 地形文件，耗时： 38:30.698
async function main02() {
    let DBName = 'DEM-wordHeights';

    console.time('打包');
    let dbTool = new DBTool(DBName);
    await dbTool.init();
    await dbTool.packFile('D:\\SQLiteFileMana\\FileResources\\DEM-wordHeights', function (e) {
        console.log(e);
    });

    // await dbTool.exportFile()
    console.timeEnd('打包');
}

// 测试导出 280W 地形文件，耗时：
async function main03() {
    console.time('打包');
    let dbTool = new DBTool('DEM-wordHeights');
    await dbTool.init();
    await dbTool.exportFile('D:\\SQLiteFileMana\\OutFile', function (e) {
        console.log(e);
    });
    console.timeEnd('打包');
}

// 常规导入
async function main04(){
    let DBName = 'MapTile-google';

    console.time('打包');
    let dbTool = new DBTool(DBName);
    await dbTool.init();
    await dbTool.packFile('D:\\SQLiteFileMana\\FileResources\\MapTile-google', function (e) {
        console.log(e);
    });
    console.timeEnd('打包');
}
// 常规导出
async function main05(){
    let DBName = 'MapTile-google';

    console.time('打包');
    let dbTool = new DBTool(DBName);
    await dbTool.init();
    await dbTool.exportFile('D:\\SQLiteFileMana\\OutFile', function (e) {
        console.log(e);
    });
    console.timeEnd('打包');
}


main05();
