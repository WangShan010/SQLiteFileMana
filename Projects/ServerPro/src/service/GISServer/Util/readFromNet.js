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
    const axios = require('axios');
    async function readFromNet({ url, headers, err, buffer, dataSource }) {
        if (!buffer) {
            await axios.get(url, {
                headers: headers || {},
                responseType: 'arraybuffer'
            }).then((res) => {
                dataSource = 'Net';
                buffer = res.data;
                err = null;
            }).catch((reqErr) => {
                err = reqErr;
            });
        }
        return [err, buffer, dataSource];
    }
    return readFromNet;
});
//# sourceMappingURL=readFromNet.js.map