/****************************************************************************
 名称：微服务管理器
 作者：超神洋葱
 描述：将资源数据库发布微服务
 最后修改日期：2021-12-05
 ****************************************************************************/

const router = require('koa-router');
const DBMana = require('../../DBMana/DBMana.js');
const FileSystem = require('../../FileSystem/FileSystem.js');

const Microservice = new router({prefix: '/Microservice'});

const DBService = new Set();

Microservice
    .get('/startService', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let param = ctx.request.query;
        param.DBName && DBService.add(param.DBName);
        ctx.body = {msg: '服务启动成功'};
    })
    .get('/connectService', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let param = ctx.request.query;
        let path = await FileSystem.choosePathDialog();
        ctx.body = {path};
    })
    .get('/endService', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let param = ctx.request.query;
        param.DBName && DBService.delete(param.DBName);
        ctx.body = {msg: '服务启动成功'};
    });


module.exports = Microservice;
