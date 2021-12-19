let DBTool = require('../../src/mainRenderer/components/DBMana/DBTool/DBTool.js');

async function main() {
    let basePath='D:\\GisFileMana\\FileResources\\MapTile-google'
    let DBName = 'MapTile-google';

    console.time('打包');
    let dbTool = new DBTool(DBName);
    await dbTool.init();


    await dbTool.packFile(basePath);
    // await dbTool.packFile('D:\\GisFileMana\\FileResources\\MapTile-google');
    // await dbTool.packFile('D:\\GisFileMana\\FileResources\\MapTile-google');


    // await dbTool.exportFile()
    console.timeEnd('打包');

    // await dbTool.getFile()
}

main()
