const NodeRSA = require('node-rsa');

let RSATool= {
    /**
     * 获取秘钥
     * @returns {{priKey: *, pubKey: *}}
     */
    createKey(b = 1024) {
        const key = new NodeRSA({b}); //生成512, 1024, 2048位的密钥
        const publicDer = key.exportKey('pkcs8-public-pem'); //公钥
        const privateDer = key.exportKey('pkcs8-private-pem');//私钥
        // 'pkcs1' — public key starts from '-----BEGIN RSA PUBLIC KEY-----' header and private key starts from '-----BEGIN RSA PRIVATE KEY-----' header
        // 'pkcs8' — public key starts from '-----BEGIN PUBLIC KEY-----' header and private key starts from '-----BEGIN PRIVATE KEY-----' header
        // 'pem'— 带有页眉和页脚的 Base64 编码字符串。默认使用。
        // 'der' — 二进制编码的密钥数据。

        return {privateDer, publicDer};
    },

    /**
     * 加密
     * @param message
     * @param pubKey
     * @returns {*}
     */
    encrypt(message, pubKey) {
        const pub = new NodeRSA(pubKey, {encryptionScheme: 'pkcs1'});

        return pub.encrypt(message, 'base64');
    },

    /**
     * 解密
     * @param encryptTxt
     * @param privateK
     * @returns {*}
     */
    decrypt(encryptTxt, privateK) {
        const pri = new NodeRSA(privateK, {encryptionScheme: 'pkcs1'});

        return pri.decrypt(encryptTxt, 'utf8');
    }
}

module.exports = RSATool;
