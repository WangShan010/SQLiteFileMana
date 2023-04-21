const readFileAsync = require('../../FSTool/readFileAsync.js');

async function readFromDisk({fileSavePath, err, buffer, dataSource}: any) {
    if (!buffer) {
        [err, buffer] = await readFileAsync(fileSavePath);
        dataSource = 'Disk';
    }

    return [err, buffer, dataSource];
}

export = readFromDisk;
