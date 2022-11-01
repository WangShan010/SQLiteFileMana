const fs = require('fs');

function readFileAsync(filePath: string, encoding: any) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, encoding, (err: any, data: Buffer) => {
            if (err) {
                resolve([err, null]);
            } else {
                resolve([null, data]);
            }
        });
    });
}


export = readFileAsync;
