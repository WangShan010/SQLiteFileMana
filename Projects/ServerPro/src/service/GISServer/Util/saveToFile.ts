const fsPromises = require('fs-promise');
const path = require('path');
const fs = require('fs');

async function saveToFile(fileSavePath: string, buffer: Buffer) {
    if (fileSavePath && buffer) {
        await fsPromises.ensureDir(path.dirname(fileSavePath));
        fs.writeFileSync(fileSavePath, buffer);
    }
}

export = saveToFile;
