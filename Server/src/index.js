const opn = require('opn');
const Koa = require('koa');
const WebSocket = require('ws');
const configTool = require('./lib/configTool.js');
const loadMiddleWare = require('./middleware/index.js');
const webSocketTool = require('./com/webSocketTool/webSocketTool.js');

const app = new Koa();

async function main() {
    // 载入中间件
    loadMiddleWare(app);

    const port = configTool.config.port;
    let server = app.listen(port, function () {
        console.log(`【静态资源目录】 ： wwwPath`);
        console.log(`【启动Web服务器】： http://localhost:${port}`);
        console.log(`【系统配置文件】 ：`, configTool.config);
        opn(`http://localhost:${port}`).then();
    });

    // 同一个端口，开启 WebSocket 服务
    const wss = new WebSocket.Server({server});
    webSocketTool.start(wss);
}


main().then();
