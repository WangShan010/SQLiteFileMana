/****************************************************************************
 名称：文件路由
 作者：超神洋葱
 描述：与应用程序相关的
 最后修改日期：2021-12-05
 ****************************************************************************/

const router = require('koa-router');

const DBMana = require('../../DBMana/DBMana.js');

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

;


module.exports = appFileRoutes;
