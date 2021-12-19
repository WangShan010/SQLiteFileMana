/****************************************************************************
 名称：微服务管理器
 作者：超神洋葱
 描述：将资源数据库发布微服务
 最后修改日期：2021-12-05
 ****************************************************************************/

const router = require('koa-router');
const DBMana = require('../../DBMana/DBMana.js');
const FileSystem = require('../../FileSystem/FileSystem.js');
const FSTool = require('../../Utils/FSTool.js');
const microService = new router({prefix: '/microService'});

const DBService = new Set();
let urlTable = require('./template/urlTable.js');

microService
    .get('/startService', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let param = ctx.request.query;
        param.DBName && DBService.add(param.DBName);
        ctx.body = {msg: '服务启动成功'};
    })
    .get('/connectService', async (ctx, next) => {
        let param = ctx.request.query;
        let DBName = param.DBName;
        let basePath = param.path;

        if (DBName || param.path) {
            let paths = await DBMana.getFileListByPath(DBName, basePath);

            console.log(paths);
            if (paths.length === 0) {
                ctx.body = await DBMana.getFileByFullPath(DBName, basePath);
            } else {
                ctx.body = urlTable.replace(
                    `{'DBName': 'MapTile-google', 'basePath': '\\', 'paths': []}`,
                    JSON.stringify({DBName, basePath, paths})
                );
            }
        } else {
            ctx.set('Content-Type', 'application/json;charset=utf-8');
            ctx.body = {'msg': '参数错误'};
        }
    })
    .get('/endService', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let param = ctx.request.query;
        param.DBName && DBService.delete(param.DBName);
        ctx.body = {msg: '服务启动成功'};
    });


module.exports = microService;
