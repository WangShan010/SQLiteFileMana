let DBMana = require('../../../src/mainRenderer/components/DBMana/DBMana.js');


async function main01() {
    let list = await DBMana.getDBList();
    // await DBMana.createDB('MapTile-google', 'D:\\SQLiteFileMana\\FileResources\\MapTile-google');
    // let file = await DBMana.getFileListByPath('MapTile-google', '\\0\\').then(e => console.log(e));
    // await DBMana.exportDB('MapTile-google', 'D:\\SQLiteFileMana\\OutFile');
    // await DBMana.getDBPathTree('MapTile-google').then(e => console.log(e));
    // await DBMana.getFileByMd5('MapTile-google', '69e4fb43d28bf4e9e874a9d90330237a').then(e => console.log(e));


    // console.log(list, file);
}


main01();
