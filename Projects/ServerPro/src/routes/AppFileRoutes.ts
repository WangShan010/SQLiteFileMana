const router = require('koa-router');
const {openDB} = require('../com/DBTool/DBConnectTool.js');
const {getContentType} = require('../lib/ContentTypeTool.js');

const appFileRoutes = new router({prefix: '/appFile'});

appFileRoutes
    .get('/getFileByFullPath', async (ctx: any) => {
        let {DBName, fullPath} = ctx.request.query;
        if (DBName && fullPath) {
            let dbTool = await openDB(DBName);
            let file = await dbTool.getFileByFullPath(fullPath);

            if (!file?.file_data) {
                throw new Error('文件不存在，路径：' + fullPath);
            } else {
                let contentType = getContentType(file.file_name);
                ctx.set('Content-Type', contentType);
                ctx.set('content-Disposition', `attachment;filename=${file.file_name}`);
                ctx.body = file.file_data;
            }
        } else {
            ctx.status = 404;
        }
    })
    .get('/getFileByMd5', async (ctx: any) => {
        let {DBName, md5} = ctx.request.query;
        if (DBName && md5) {
            let dbTool = await openDB(DBName);
            let file = await dbTool.getFileByMd5(md5);

            if (!file?.file_data) {
                throw new Error('文件不存在，MD5：' + md5);
            } else {
                let contentType = getContentType(file.file_name);
                ctx.set('Content-Type', contentType);
                ctx.set('content-Disposition', `attachment;filename=${file.file_name}`);
                ctx.body = file.file_data;
            }
        } else {
            ctx.status = 404;
        }
    });


export = appFileRoutes;
