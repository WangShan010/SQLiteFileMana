const configTool = require('../../../com/configTool');
const fsPromises = require('fs-promise');
const path = require('path');
const fs = require('fs');

async function saveFile({fileSavePath, buffer}) {
    if (configTool.config.CacheSaveFile && fileSavePath && buffer) {
        await fsPromises.ensureDir(path.dirname(fileSavePath));
        fs.writeFileSync(fileSavePath, buffer);
    }
}


module.exports = saveFile;