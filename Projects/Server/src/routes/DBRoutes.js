const router = require('koa-router');
const url = require('url');
const {openDB} = require('../com/DBTool/DBConnectTool');
const {getContentType} = require('../lib/ContentTypeTool.js');
const DBRoutes = new router({prefix: '/DBService'});

// 通配符的写法
DBRoutes
    .get('/(.*)', async (ctx, next) => {
        let reqUrl = ctx.request.url.replace('/DBService/', '');
        let urlObj = url.parse(reqUrl, true);
        // let query = urlObj.query;
        reqUrl =  decodeURI(urlObj.pathname);

        let pathItem = reqUrl.split('/');

        if (pathItem?.length) {
            let DBName = pathItem.shift();
            let fullPath = '\\' + pathItem.join('\\');

            let file
            let dbTool = await openDB(DBName);


            if (dbTool) {
                file = await dbTool.getFileByFullPath(fullPath, false);
            }else {
                ctx.set('Content-Type', 'application/json;charset=utf-8');
                ctx.body = JSON.stringify({message: `数据库不存在：【${DBName}】`});
            }

            if (!file?.file_data) {
                ctx.status = 422;
                ctx.set('Content-Type', 'application/json;charset=utf-8');
                ctx.body = JSON.stringify({message: `数据库：【${DBName}】，找不到该文件，路径：【${fullPath}】`});
            } else {
                let contentType = getContentType(file.file_name);
                file.file_zip === 'gzip' && (ctx.set('Content-Encoding', 'gzip'));
                ctx.set('Content-Type', contentType);
                ctx.body = file.file_data;
            }
        }
    })
;


module.exports = DBRoutes;
