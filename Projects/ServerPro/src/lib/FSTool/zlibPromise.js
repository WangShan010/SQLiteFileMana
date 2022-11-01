(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    const zlib = require('zlib');
    const zlibPromise = {
        zip: async function (data) {
            return new Promise(function (resolve, reject) {
                zlib.gzip(data, function (err, buffer) {
                    resolve(buffer);
                });
            });
        },
        unzip: async function (buffer) {
            return new Promise(function (resolve, reject) {
                if (!buffer) {
                    resolve(['input needs to be a Buffer', null]);
                }
                else {
                    zlib.unzip(buffer, function (err, buffer) {
                        resolve(buffer);
                    });
                }
            });
        }
    };
    return zlibPromise;
});
//# sourceMappingURL=zlibPromise.js.map