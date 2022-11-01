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
    const CesiumTerrain = require('../service/GISServer/CesiumTerrain/CesiumTerrain.js');
    const MapBoxTile = require('../service/GISServer/MapboxTile/MapboxTile.js');
    const OSMTile = require('../service/GISServer/OSMTile/OSMTile.js');
    const awaitWrap = require('../lib/awaitWrap.js');
    const configTool = require('../com/configTool.js');
    const FSTool = require('../lib/FSTool/index.js');
    const cacheRoutes = new router({ prefix: '/cacheServer' });
    cacheRoutes
        .get('/api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/:z/:x/:y.jpeg', async (ctx) => {
        let { z, x, y } = ctx.params;
        let [err, buffer] = await MapBoxTile.getFileBuffer(z, x, y);
        if (buffer) {
            ctx.set('Content-Type', 'image/jpeg');
            ctx.body = buffer;
        }
        else {
            ctx.status = 422;
            ctx.body = err;
            console.log('代理 MapBoxTile 瓦片失败', z, x, y);
        }
    })
        .get('/tile.openstreetmap.org/:z/:x/:y.png', async (ctx) => {
        let { z, x, y } = ctx.params;
        let [err, buffer] = await OSMTile.getFileBuffer(z, x, y);
        if (buffer) {
            ctx.set('Content-Type', 'image/jpeg');
            ctx.body = buffer;
        }
        else {
            ctx.status = 422;
            ctx.body = err;
            console.log('代理 OSM 瓦片失败', z, x, y);
        }
    })
        .get('/assets.cesium.com/1/:url(.*)', async (ctx) => {
        let url = ctx.params.url;
        let [err, buffer] = await CesiumTerrain.getFileBuffer(url);
        if (buffer) {
            ctx.body = buffer;
        }
        else {
            ctx.status = 422;
            ctx.body = err;
            console.log(`代理 Cesium 官方地形数据失败，${ctx.url}`);
        }
    })
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