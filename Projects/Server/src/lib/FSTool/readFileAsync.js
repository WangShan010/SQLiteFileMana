const fs = require('fs');

function readFileAsync(filePath, encoding) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                resolve([err, null]);
            } else {
                resolve([null, data]);
            }
        });
    });
}


module.exports = readFileAsync;
