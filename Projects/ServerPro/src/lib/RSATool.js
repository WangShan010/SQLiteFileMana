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
    const rs = require('jsrsasign');
    let RSATool = {
        createKey(b = 2048) {
            let rsaKeypair = rs.KEYUTIL.generateKeypair('RSA', b);
            let publicDer = rs.KEYUTIL.getPEM(rsaKeypair.pubKeyObj);
            let privateDer = rs.KEYUTIL.getPEM(rsaKeypair.prvKeyObj, 'PKCS8PRV');
            return { privateDer, publicDer };
        },
        encrypt(message, pubKey) {
            let pub = rs.KEYUTIL.getKey(pubKey);
            return rs.KJUR.crypto.Cipher.encrypt(message, pub);
        },
        decrypt(encryptTxt, privateK) {
            let pub = rs.KEYUTIL.getKey(privateK);
            return rs.KJUR.crypto.Cipher.decrypt(encryptTxt, pub);
        }
    };
    return RSATool;
});
//# sourceMappingURL=RSATool.js.map