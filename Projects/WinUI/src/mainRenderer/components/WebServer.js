const path = require('path');
const FileSystem = require('./FileSystem.js');
const Koa = require('koa');
const koaStatic = require('koa-static');
const cors = require('koa2-cors');
const router = require('koa-router');

const hostname = '127.0.0.1';
const port = 3002;
const APP = new Koa();


const sysFileRoutes = new router({prefix: '/sysFile'});

sysFileRoutes
    .get('/choosePath', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let choosePath = await FileSystem.choosePathDialog();
        ctx.status = choosePath ? 200 : 500;
        ctx.body = JSON.stringify({path: choosePath});
    })
    .get('/openCatalogue', async (ctx, next) => {
        let {path:pathToOpen} = ctx.request.query;
        if (pathToOpen) {
            await FileSystem.openCatalogue(pathToOpen);
            ctx.status = 200;
            ctx.body =JSON.stringify({path: pathToOpen});
        }else {
            ctx.status = 500;
            ctx.body =JSON.stringify({path: 'Error'});
        }
    });


let WebServer = {
    run: async function () {
        APP.listen(port, function () {
            APP.use(koaStatic(path.join(__dirname, '../../webRenderer/')), {defer: true});
            APP.use(cors());
            APP.use(sysFileRoutes.routes());
            console.log(`服务器运行在 http://${hostname}:${port}/`);
        });
    }
};


module.exports = WebServer;
