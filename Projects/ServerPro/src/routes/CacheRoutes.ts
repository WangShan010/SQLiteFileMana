const fs = require('fs');
const fsPromises = require('fs-promise');
const path = require('path');
const router = require('koa-router');
const axios = require('axios');
const {getContentType, getExt} = require('../lib/ContentTypeTool.js');
const awaitWrap = require('../lib/awaitWrap.js');
const configTool = require('../com/configTool.js');
const FSTool = require('../lib/FSTool/index.js');

const cacheRoutes = new router({prefix: '/cacheServer'});

cacheRoutes
    // 例如：
    //      原URL：https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json
    //      调用：http://localhost:3000/cacheServer/https/geo.datav.aliyun.com/areas_v3/bound/100000_full.json
    .get('/:protocol/:ip/:port/:url(.*)', async (ctx: any) => {
        let protocol = ctx.params.protocol === 'http' ? 'http://' : 'https://';
        let ip = ctx.params.ip;
        let port = ctx.params.port;
        let url = ctx.params.url;
        let reqUrl = `${protocol}${ip}:${port}/${url}`;

        // 缓存文件保存的绝对路径
        let fileSavePath = path.join(configTool.appBasePath, 'temp/fileOut', `${ctx.params.protocol}/${ip}/${port}/${url}`);
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

            // 未缓存过的其他网络资源
            if (!res) {
                [err, res] = await awaitWrap(axios.get(reqUrl, {responseType: 'arraybuffer'}));
                if (err) {
                    ctx.status = 422;
                    ctx.body = err;
                } else {
                    for (const resKey in res.headers) {
                        ctx.set(resKey, res.headers[resKey]);
                    }
                    ctx.body = res.data;
                    // 存入缓存文件
                    if (configTool.preservableONFile()) {
                        // 如果 Url 里面有文件名，则保存到文件中
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

export = cacheRoutes;
