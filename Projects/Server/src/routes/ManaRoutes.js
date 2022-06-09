const router = require('koa-router');
const DBTool = require('../com/DBTool/DBTool.js');
const getServerInfo = require('../lib/getServerInfo.js');
const configTool = require('../com/configTool.js');
const FSTool = require('../lib/FSTool/index.js');
const {openDB, closeAll} = require('../com/DBTool/DBConnectTool.js');
const path = require('path');
const ManageRoutes = new router({prefix: '/manage'});


ManageRoutes
    .get('/getServerInfo', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let ServerInfo = getServerInfo();
        await configTool.init();
        ServerInfo.appBasePath = configTool.appBasePath;
        ctx.body = JSON.stringify(ServerInfo);
    })
    .get('/scanPath', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let {path} = ctx.request.query;
        let fileCount = (await FSTool.getFileList(path)).length;
        ctx.body = JSON.stringify({fileCount});
    })
    .get('/getDBList', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let fileInfoList = await DBTool.getDBList() || [];
        ctx.body = JSON.stringify(fileInfoList);
    })
    .get('/getDBPathTree', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let {DBName} = ctx.request.query;
        let dbTool = await openDB(DBName);
        let res = await dbTool.getDBPathTree();
        ctx.body = JSON.stringify(res);
    })
    .get('/getFileListByPath', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let {DBName, path} = ctx.request.query;
        let dbTool = await openDB(DBName);
        let res = await dbTool.getDirListByPath(path);
        ctx.body = JSON.stringify(res);
    })
    .get('/getDirInfo', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let {DBName, dirPath} = ctx.request.query;
        let dbTool = await openDB(DBName);
        let res = await dbTool.getDirInfo(dirPath);
        ctx.body = JSON.stringify(res);
    })
    .get('/createDB', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let {DBName, targetDirectory, mataData} = ctx.request.query;
        if (mataData) {
            mataData = JSON.parse(mataData);
        }
        let msg = await DBTool.createDB(DBName, targetDirectory, mataData);
        ctx.body = JSON.stringify({msg});
    })
    .get('/appendFile', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let {DBName, targetDirectory, currentDirectory} = ctx.request.query;

        console.log(DBName, targetDirectory, currentDirectory);
        let msg = await DBTool.appendFile(DBName, targetDirectory, currentDirectory);
        ctx.body = JSON.stringify({msg});
    })
    .get('/wipeCache', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let {DBName} = ctx.request.query;
        let dbTool = await openDB(DBName);
        let res = await dbTool.wipeCache();
        ctx.body = JSON.stringify(res);
    })
    .get('/setMataData', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let {DBName, mataData} = ctx.request.query;
        let dbTool = await openDB(DBName);
        if (mataData) {
            mataData = JSON.parse(mataData);
        }
        let msg = await dbTool.setMataData(mataData);
        ctx.body = JSON.stringify({msg});
    })
    .get('/deleteByFullPath', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let {DBName, fullPath} = ctx.request.query;
        let dbTool = await openDB(DBName);
        let res = await dbTool.deleteByFullPath(fullPath);
        ctx.body = JSON.stringify(res);
    })
    .get('/deleteByDir', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let {DBName, directory} = ctx.request.query;
        let dbTool = await openDB(DBName);
        let res = await dbTool.deleteByDir(directory);
        ctx.body = JSON.stringify(res);
    })
    .get('/exportDB', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let {DBName, targetDirectory} = ctx.request.query;
        let param = ctx.request.query;
        let res = await DBTool.exportDB(DBName, targetDirectory);
        ctx.body = JSON.stringify({res});
    })
    .get('/deleteDB', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let {DBName} = ctx.request.query;
        if (DBName) {
            await closeAll();
            let result = await DBTool.deleteDB(DBName);
            ctx.body = JSON.stringify({result});
        } else {
            ctx.status = 404;
        }
    })
    .get('/getFileBySearch', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let {DBName, text} = ctx.request.query;
        if (DBName && text) {
            let dbTool = await openDB(DBName);
            let list = await dbTool.getFileListBySearch(text);
            list.map(item => item.ext = path.extname(item.file_name));
            ctx.body = JSON.stringify(list);
        } else {
            ctx.status = 404;
        }
    })
;


module.exports = ManageRoutes;
