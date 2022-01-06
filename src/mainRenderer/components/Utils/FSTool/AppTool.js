const path = require('path');

const rootPath = path.join(__dirname, '../'.repeat(50));
const basePath = path.join(rootPath, './SQLiteFileMana');


const APP = {
    basePath
};

module.exports = APP;
