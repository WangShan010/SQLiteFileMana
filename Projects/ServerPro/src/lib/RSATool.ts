const rs = require('jsrsasign');

let RSATool = {
    /**
     * 获取秘钥
     * @returns {{priKey: *, pubKey: *}}
     */
    createKey(b = 2048) {
        let rsaKeypair = rs.KEYUTIL.generateKeypair('RSA', b);
        // 密钥对象获取 pem 格式的密钥
        let publicDer = rs.KEYUTIL.getPEM(rsaKeypair.pubKeyObj);
        let privateDer = rs.KEYUTIL.getPEM(rsaKeypair.prvKeyObj, 'PKCS8PRV');
        return {privateDer, publicDer};
    },

    encrypt(message: string, pubKey: string) {
        let pub = rs.KEYUTIL.getKey(pubKey);
        return rs.KJUR.crypto.Cipher.encrypt(message, pub);
    },

    decrypt(encryptTxt: string, privateK: string) {
        let pub = rs.KEYUTIL.getKey(privateK);
        return rs.KJUR.crypto.Cipher.decrypt(encryptTxt, pub);
    }
};

export = RSATool;
