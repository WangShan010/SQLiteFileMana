const opn = require('opn');
const path = require('path');
const Koa = require('koa');
const cors = require('koa2-cors');
const compress = require('koa-compress');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const koaStatic = require('koa-static');
const WebSocket = require('ws');
const configTool = require('./Lib/configTool.js');


const webSocketTool = require('./webSocketTool/webSocketTool.js');
const appFileRoutes = require('./routes/appFileRoutes.js');
const sysFileRoutes = require('./routes/sysFileRoutes.js');
const microService = require('./routes/microService.js');

const app = new Koa();

async function main() {
    await configTool.init();

    const config = await configTool.config;
    const port = config.port;

    app.use(cors());
    app.use(compress());
    app.use(bodyParser());
    app.use(router.routes());
    app.use(koaStatic(path.join(configTool.appBasePath, config.webSite)));


    app.use(appFileRoutes.routes());
    app.use(sysFileRoutes.routes());
    app.use(microService.routes());

    let server = app.listen(port, function () {
        console.log(`【静态资源目录】 ： wwwPath`);
        console.log(`【启动Web服务器】： http://localhost:${port}`);
        console.log(`【系统配置文件】 ：`, config);
        // opn(`http://localhost:${port}`).then();
    });


    // 同一个端口，开启 WebSocket 服务
    const wss = new WebSocket.Server({server});
    webSocketTool.start(wss);
}


main().then();
