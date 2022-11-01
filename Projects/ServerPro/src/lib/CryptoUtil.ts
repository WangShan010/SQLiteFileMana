const CryptoJS = require('crypto-js');

class CryptoUtil {
    static Encrypt(dataStr:string, key:string) {
        return CryptoJS.AES.encrypt(dataStr, key).toString();
    }

    static Decrypt(ciphertext:string, key:string) {
        let bytes = CryptoJS.AES.decrypt(ciphertext, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
}


export = CryptoUtil;
