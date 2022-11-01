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
    const CryptoJS = require('crypto-js');
    class CryptoUtil {
        static Encrypt(dataStr, key) {
            return CryptoJS.AES.encrypt(dataStr, key).toString();
        }
        static Decrypt(ciphertext, key) {
            let bytes = CryptoJS.AES.decrypt(ciphertext, key);
            return bytes.toString(CryptoJS.enc.Utf8);
        }
    }
    return CryptoUtil;
});
//# sourceMappingURL=CryptoUtil.js.map