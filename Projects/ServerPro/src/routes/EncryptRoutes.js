var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "url", "../com/DBTool/DBConnectTool", "../lib/CryptoUtil.js", "../lib/FSTool/zlibPromise.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    const router = require('koa-router');
    const url_1 = __importDefault(require("url"));
    const DBConnectTool_1 = require("../com/DBTool/DBConnectTool");
    const CryptoUtil_js_1 = __importDefault(require("../lib/CryptoUtil.js"));
    const zlibPromise_js_1 = __importDefault(require("../lib/FSTool/zlibPromise.js"));
    const EncryptRoutes = new router({ prefix: '/Encrypt' });
    EncryptRoutes
        .get('/(.*)', async (ctx) => {
        let reqUrl = ctx.request.url.replace('/Encrypt/', '');
        let urlObj = url_1.default.parse(reqUrl, true);
        reqUrl = decodeURI(urlObj.pathname);
        let pathItem = reqUrl.split('/');
        if (pathItem?.length) {
            let DBName = pathItem.shift();
            let fullPath = '/' + pathItem.join('/');
            let file;
            let dbTool = await (0, DBConnectTool_1.openDB)(DBName);
            if (dbTool) {
                file = await dbTool.getFileByFullPath(fullPath, false);
            }
            else {
                ctx.status = 422;
                ctx.set('Content-Type', 'application/json;charset=utf-8');
                ctx.body = JSON.stringify({ message: `数据库不存在：【${DBName}】，正在新建数据库中，请稍后...` });
                return;
            }
            if (!file?.file_data) {
                ctx.status = 422;
                ctx.set('Content-Type', 'application/json;charset=utf-8');
                ctx.body = JSON.stringify({ message: `数据库：【${DBName}】，不存在该文件资源，路径：【${fullPath}】` });
            }
            else {
                file.file_data = file.file_zip === 'gzip' ? await zlibPromise_js_1.default.unzip(file.file_data) : file.file_data;
                let hexStr = file.file_data.toString('hex');
                ctx.body = {
                    code: 200,
                    name: file.file_name,
                    md5: file.file_md5,
                    message: '数据包已加密，加密等级：最高',
                    version: 'ServerPro V1.9',
                    generateTool: 'https://gitee.com/WangShan010/SQLiteFileMana',
                    content: CryptoUtil_js_1.default.Encrypt(hexStr, '1234567890')
                };
            }
        }
    });
    return EncryptRoutes;
});
//# sourceMappingURL=EncryptRoutes.js.map