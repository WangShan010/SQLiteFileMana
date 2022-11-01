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
    let SafeTool = {
        randomString(len) {
            len = len || 8;
            let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            let maxPos = $chars.length;
            let pwd = '';
            for (let i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        },
        generateUUID() {
            let d = new Date().getTime();
            let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                let r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });
            return uuid;
        },
        checkPwd: function (str) {
            let nowLv = 0;
            if (str.length < 6) {
                return nowLv;
            }
            if (/[0-9]/.test(str)) {
                nowLv++;
            }
            if (/[a-z]/.test(str)) {
                nowLv++;
            }
            if (/[A-Z]/.test(str)) {
                nowLv++;
            }
            if (/[\.|-|_]/.test(str)) {
                nowLv++;
            }
            return nowLv;
        }
    };
    return SafeTool;
});
//# sourceMappingURL=SafeTool.js.map