/****************************************************************************
 名称：文件路由
 作者：望山010
 描述：与应用程序相关的
 最后修改日期：2021-12-05
 ****************************************************************************/

const router = require('koa-router');

const DBMana = require('../DBMana/DBMana.js');

const appFileRoutes = new router({prefix: '/appFile'});

appFileRoutes
    .get('/getDBList', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let fileInfoList = await DBMana.getDBList();
        ctx.body = JSON.stringify(fileInfoList);
    })
    .get('/getDBPathTree', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let param = ctx.request.query;
        let res = await DBMana.getDBPathTree(param.DBName);
        ctx.body = JSON.stringify(res);
    })
    .get('/getFileListByPath', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let param = ctx.request.query;
        let res = await DBMana.getFileListByPath(param.DBName, param.path);
        ctx.body = JSON.stringify(res);
    })
    .get('/createDB', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        console.log('准备创建数据库');
        let param = ctx.request.query;
        let res = await DBMana.createDB(param.DBName, param.targetDirectory);
        ctx.body = JSON.stringify({res});
    })
    .get('/exportDB', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        console.log('导出资源库');
        let param = ctx.request.query;
        let res = await DBMana.exportDB(param.DBName, param.targetDirectory);
        ctx.body = JSON.stringify({res});
    })
    .get('/getFileByFullPath', async (ctx, next) => {
        ctx.set('Content-Type', 'image/png');
        console.log('获取资源');
        let param = ctx.request.query;
        let fileBlob = await DBMana.getFileByFullPath(param.DBName, param.path);
        ctx.body = fileBlob;
    })

;


module.exports = appFileRoutes;
