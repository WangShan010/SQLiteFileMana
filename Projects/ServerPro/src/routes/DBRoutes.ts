const router = require('koa-router');
import url from 'url';
import {openDB} from '../com/DBTool/DBConnectTool';
import {getContentType} from '../lib/ContentTypeTool.js';

const DBRoutes = new router({prefix: '/DBService'});

// 通配符的写法
DBRoutes
    .get('/(.*)', async (ctx: any) => {
        let reqUrl = ctx.request.url.replace('/DBService/', '');
        let urlObj = url.parse(reqUrl, true) as any;
        // let query = urlObj.query;
        reqUrl = decodeURI(urlObj.pathname);

        let pathItem = reqUrl.split('/');

        if (pathItem?.length) {
            let DBName = pathItem.shift();
            let fullPath = '/' + pathItem.join('/');

            let file;
            let dbTool = await openDB(DBName);

            if (dbTool) {
                file = await dbTool.getFileByFullPath(fullPath, false);
            } else {
                ctx.status = 422;
                ctx.set('Content-Type', 'application/json;charset=utf-8');
                ctx.body = JSON.stringify({message: `数据库不存在：【${DBName}】，正在新建数据库中，请稍后...`});
                return;
            }

            if (!file || !file.file_data) {
                ctx.status = 422;
                ctx.set('Content-Type', 'application/json;charset=utf-8');
                ctx.body = JSON.stringify({message: `数据库：【${DBName}】，不存在该文件资源，路径：【${fullPath}】`});
            } else {
                let contentType = getContentType(file.file_name);
                file.file_zip === 'gzip' && (ctx.set('Content-Encoding', 'gzip'));
                ctx.set('Content-Type', contentType);
                ctx.body = file.file_data;
            }
        }
    })
;


export = DBRoutes;
