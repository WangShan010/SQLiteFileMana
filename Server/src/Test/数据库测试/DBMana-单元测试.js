let DBMana = require('../../com/DBMana/DBMana.js');

async function main01() {
    let list = await DBMana.getDBList();
    console.log(JSON.stringify(list));
}

// 创建资源库， 280W 地形文件，耗时： 38:30.698
async function main02() {
    let createState = await DBMana.createDB('DEM-wordHeights', 'H:\\SQLiteFileMana\\FileResources\\DEM-wordHeights\\8');
    console.log(createState);
}
// 创建资源库， 23GB 瓦片文件，耗时：12:09
async function main03() {
    let createState = await DBMana.createDB('MapTile-google', 'D:\\VGEServer\\vge-software-resources\\jiaxing\\DOM');
    console.log(createState);
}

async function main04() {
    let file = await DBMana.getFileListByPath('MapTile-google', '\\0\\').then(e => console.log(e));
    console.log(file);
}

async function main05() {
    let exportState =  await DBMana.exportDB('MapTile-google', 'C:\\Users\\23948\\Desktop\\1');
    console.log(exportState);
    // await DBMana.getDBPathTree('MapTile-google').then(e => console.log(e));
    // await DBMana.getFileByMd5('MapTile-google', '69e4fb43d28bf4e9e874a9d90330237a').then(e => console.log(e));
}

async function main06() {
    await DBMana.getDBPathTree('MapTile-google').then(e => console.log(e));
}

async function main010(){
    await DBMana.getFileByMd5('MapTile-google', '69e4fb43d28bf4e9e874a9d90330237a').then(e => console.log(e));
}


main02().then();
