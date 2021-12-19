/****************************************************************************
 名称：文件路由
 作者：超神洋葱
 描述：与操作系统相关的
 最后修改日期：2021-12-05
 ****************************************************************************/


const router = require('koa-router');
const DBMana = require('../../DBMana/DBMana.js');
const FileSystem = require('../../FileSystem/FileSystem.js');


const sysFileRoutes = new router({prefix: '/sysFile'});

sysFileRoutes
    .get('/choosePath', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let path = await FileSystem.choosePathDialog();
        ctx.body = {path};
    })
    .get('/scanFolder', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let path = await FileSystem.choosePathDialog();
        ctx.body = {path};
    })
;


module.exports = sysFileRoutes;
