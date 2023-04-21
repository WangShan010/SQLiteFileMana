const path = require('path');
const {openDB} = require('../../../com/DBTool/DBConnectTool.js');
import zlibPromise from '../../../lib/FSTool/zlibPromise.js';

async function saveToDB({DBName, relativePath, buffer}: any, needCompress = false) {
    if (DBName && relativePath && buffer) {
        let dbTool = await openDB(DBName);

        buffer = needCompress ? await zlibPromise.zip(buffer) : buffer;
        await dbTool.insertData([{
            relativePath: relativePath,
            fileName: path.basename(relativePath),
            buffer: buffer,
            compressType: needCompress ? 'gzip' : '',
            md5: require('crypto').createHash('md5').update(buffer).digest('hex'),
            size: buffer.length
        }], null, 'large', false);
    }
}

export = saveToDB;
