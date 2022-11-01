var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    const fs_1 = __importDefault(require("fs"));
    async function fileMd5(path) {
        const buffer = fs_1.default.readFileSync(path);
        return require('crypto').createHash('md5').update(buffer).digest('hex');
    }
    return fileMd5;
});
//# sourceMappingURL=fileMd5.js.map