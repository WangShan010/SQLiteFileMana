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
    const fs = require('fs');
    const fsPromises = require('fs-promise');
    const path = require('path');
    const router = require('koa-router');
    const axios = require('axios');
    const { getContentType, getExt } = require('../lib/ContentTypeTool.js');
    const awaitWrap = require('../lib/awaitWrap.js');
    const configTool = require('../com/configTool.js');
    const FSTool = require('../lib/FSTool/index.js');
    const cacheRoutes = new router({ prefix: '/cacheServer' });
    cacheRoutes
        .get('/:protocol/:ip/:port/:url(.*)', async (ctx) => {
        let protocol = ctx.params.protocol === 'http' ? 'http://' : 'https://';
        let ip = ctx.params.ip;
        let port = ctx.params.port;
        let url = ctx.params.url;
        let reqUrl = `${protocol}${ip}:${port}/${url}`;
        let fileSavePath = path.join(configTool.appBasePath, 'temp/fileOut', `${ctx.params.protocol}/${ip}/${port}/${url}`);
        let fileDir = path.dirname(fileSavePath);
        if (url) {
            let [err, res] = await FSTool.readFileAsync(fileSavePath);
            if (res) {
                let contentType = getContentType(fileSavePath);
                ctx.set('Content-Type', contentType);
                ctx.body = res;
            }
            if (!res) {
                [err, res] = await awaitWrap(axios.get(reqUrl, { responseType: 'arraybuffer' }));
                if (err) {
                    ctx.status = 422;
                    ctx.body = err;
                }
                else {
                    for (const resKey in res.headers) {
                        ctx.set(resKey, res.headers[resKey]);
                    }
                    ctx.body = res.data;
                    if (configTool.preservableONFile()) {
                        if (!path.extname(fileSavePath)) {
                            fileSavePath += getExt(res.headers['content-type']);
                        }
                        await fsPromises.ensureDir(fileDir);
                        fs.writeFileSync(fileSavePath, res.data);
                    }
                }
            }
        }
    });
    return cacheRoutes;
});
//# sourceMappingURL=CacheRoutes.js.map