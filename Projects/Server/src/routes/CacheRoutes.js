const fs = require('fs');
const fsPromises = require('fs-promise');
const path = require('path');
const router = require('koa-router');
const axios = require('axios');
const {getContentType, getExt} = require('../lib/ContentTypeTool.js');
const CesiumTerrain = require('../service/GISServer/CesiumTerrain/CesiumTerrain.js');
const MapBoxTile = require('../service/GISServer/MapBoxTile/MapBoxTile.js');
const OSMTile = require('../service/GISServer/OSMTile/OSMTile.js');
const awaitWrap = require('../lib/awaitWrap.js');
const configTool = require('../com/configTool.js');
const FSTool = require('../lib/FSTool/index.js');

const cacheRoutes = new router({prefix: '/cacheServer'});

cacheRoutes
    .get('/api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/:z/:x/:y.jpeg', async (ctx) => {
        let {z, x, y} = ctx.params;
        let [err, buffer] = await MapBoxTile.getFileBuffer(z, x, y);

        if (buffer) {
            ctx.set('Content-Type', 'image/jpeg');
            ctx.body = buffer;
        } else {
            ctx.status = 422;
            ctx.body = err;
            console.log('代理 MapBoxTile 瓦片失败', z, x, y);
        }
    })
    .get('/tile.openstreetmap.org/:z/:x/:y.png', async (ctx) => {
        let {z, x, y} = ctx.params;
        let [err, buffer] = await OSMTile.getFileBuffer(z, x, y);
        if (buffer) {
            ctx.set('Content-Type', 'image/jpeg');
            ctx.body = buffer;
        } else {
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
        } else {
            ctx.status = 422;
            ctx.body = err;
            console.log(`代理 Cesium 官方地形数据失败，${ctx.url}`);
        }
    })
    // 例如：
    //      原URL：https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json
    //      调用：http://localhost:3000/cacheServer/https/geo.datav.aliyun.com/areas_v3/bound/100000_full.json
    .get('/:protocol/:url(.*)', async (ctx, next) => {
        let protocol = ctx.params.protocol === 'http' ? 'http://' : 'https://';
        let url = ctx.params.url;

        // 缓存文件保存的绝对路径
        let fileSavePath = path.join(configTool.appBasePath, 'temp/fileOut', url);
        let fileDir = path.dirname(fileSavePath);

        if (url) {
            // 判断是否有缓存文件
            let [err, res] = await FSTool.readFileAsync(fileSavePath);
            // 缓存文件
            if (res) {
                let contentType = getContentType(fileSavePath);
                ctx.set('Content-Type', contentType);
                ctx.body = res;
            }

            // 其他网络资源
            if (!res) {
                [err, res] = await awaitWrap(axios.get(protocol + url, {responseType: 'arraybuffer'}));
                if (res) {
                    for (const resKey in res.headers) {
                        ctx.set(resKey, res.headers[resKey]);
                    }
                    ctx.body = res.data;
                    // 存入缓存文件
                    if (configTool.config.CacheSaveFile) {
                        // 如果 Url 里面有文件名，则保存到文件中
                        if (!path.extname(fileSavePath)) {
                            fileSavePath += getExt(res.headers['content-type']);
                        }
                        await fsPromises.ensureDir(fileDir);
                        fs.writeFileSync(fileSavePath, res.data);
                    }
                    // 存入缓存数据库
                    if (configTool.config.CacheSaveDB) {

                    }
                } else {
                    ctx.status = 422;
                    ctx.body = err;
                }
            }


        }
    });


/**
 * 将文件存入本地缓存
 * @param fileSavePath      完整路径名称，例如：assets.cesium.com/1/layer.json
 * @param axiosRes          axios 返回的数据
 * @returns {Promise<void>}
 */
async function saveFile(fileSavePath, axiosRes) {
    if (configTool.config.CacheSaveFile) {
        // 如果 Url 里面有文件名，则保存到文件中
        if (!path.extname(fileSavePath)) {
            fileSavePath += getExt(axiosRes.headers['content-type']);
        }
        await fsPromises.ensureDir(path.dirname(fileSavePath));
        fs.writeFileSync(fileSavePath, axiosRes.data);
    }
}

module.exports = cacheRoutes;
