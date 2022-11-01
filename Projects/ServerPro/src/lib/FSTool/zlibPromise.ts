const zlib = require('zlib');

const zlibPromise = {
    // 参数一表示要压缩的数据，可以是string或buffer
    zip: async function (data: Buffer | string) {
        return new Promise(function (resolve, reject) {
            //buffer就是压缩后的数据
            zlib.gzip(data, function (err: Error | null, buffer: Buffer) {
                resolve(buffer);
            });
        });
    },

    // 对buffer数据进行解压
    unzip: async function (buffer: Buffer) {
        return new Promise(function (resolve, reject) {
            if (!buffer) {
                resolve(['input needs to be a Buffer', null]);
            } else {
                zlib.unzip(buffer, function (err: Error | null, buffer: Buffer) {
                    resolve(buffer);
                });
            }
        });
    }
};


export = zlibPromise;
