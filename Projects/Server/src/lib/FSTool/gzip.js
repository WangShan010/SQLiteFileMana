const zlib = require('zlib');

const zlibPromise = {};

// 参数一表示要压缩的数据，可以是string或buffer
zlibPromise.zip = async function (data) {
    return new Promise(function (resolve, reject) {
        //buffer就是压缩后的数据
        zlib.gzip(data, function (err, buffer) {
            resolve(buffer);
        });
    });
};

// 对buffer数据进行解压
zlibPromise.unzip = async function (buffer) {
    return new Promise(function (resolve, reject) {
        if (!Buffer.isBuffer(buffer)) {
            resolve(['input needs to be a Buffer', null]);
        } else {
            zlib.unzip(buffer, function (err, buffer) {
                resolve(buffer);
            });
        }
    });
};


module.exports = zlibPromise;
