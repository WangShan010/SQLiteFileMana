const path = require('path');
const configTool = require('../../../com/configTool.js');
const {openDB} = require('../../../com/DBTool/DBConnectTool.js');
const zipBuffer = require('../../../lib/FSTool/gzip.js');

async function saveOnDB({DBName, relativePath, buffer}, needCompress = false) {
    if (configTool.config.CacheSaveDB && DBName && relativePath && buffer) {
        let dbTool = await openDB(DBName);

        let zipBuffer = needCompress ? await zipBuffer(buffer) : buffer;
        await dbTool.insertData([{
            relativePath: relativePath,
            fileName: path.basename(relativePath),
            buffer: zipBuffer,
            compressType: needCompress ? 'gzip' : '',
            md5: require('crypto').createHash('md5').update(buffer).digest('hex'),
            size: buffer.length
        }], null, 'large', false);
    }
}


module.exports = saveOnDB;
