var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "url", "../com/DBTool/DBConnectTool", "../lib/ContentTypeTool.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    const router = require('koa-router');
    const url_1 = __importDefault(require("url"));
    const DBConnectTool_1 = require("../com/DBTool/DBConnectTool");
    const ContentTypeTool_js_1 = require("../lib/ContentTypeTool.js");
    const DBRoutes = new router({ prefix: '/DBService' });
    DBRoutes
        .get('/(.*)', async (ctx) => {
        let reqUrl = ctx.request.url.replace('/DBService/', '');
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
                let contentType = (0, ContentTypeTool_js_1.getContentType)(file.file_name);
                file.file_zip === 'gzip' && (ctx.set('Content-Encoding', 'gzip'));
                ctx.set('Content-Type', contentType);
                ctx.body = file.file_data;
            }
        }
    });
    return DBRoutes;
});
//# sourceMappingURL=DBRoutes.js.map