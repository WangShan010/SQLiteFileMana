const path = require('path');
const createFile = require('../Lib/FSTool/createFile.js');
const createDirectory = require('../Lib/FSTool/createDirectory.js');


const rootPath = path.join(__dirname, '../'.repeat(50));
const appBasePath = path.join(rootPath, './SQLiteFileMana');


(async function init() {
    await createFile(appBasePath + '/日志.txt', '初始化成功\n');
    await createDirectory(appBasePath + '/Cache/');
    await createDirectory(appBasePath + '/FileResources/');
    await createDirectory(appBasePath + '/MapDB/');
    await createDirectory(appBasePath + '/OutFile/');
})();

module.exports = appBasePath;
