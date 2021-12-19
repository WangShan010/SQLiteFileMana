/****************************************************************************
 名称：后台服务
 作者：超神洋葱
 描述：发布本地服务
 最后修改日期：2021-12-05
 ****************************************************************************/


const Koa = require('koa');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const WebSocket = require('ws');

const webSocketTool = require('./webSocketTool/webSocketTool.js');
const appFileRoutes = require('./routes/appFileRoutes.js');
const sysFileRoutes = require('./routes/sysFileRoutes.js');
const Microservice = require('./routes/Microservice.js');
const port = 3000;

const app = new Koa();
app.use(cors());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods({
    // throw: true, // 抛出错误，代替设置响应头状态
    // notImplemented: () => '不支持当前请求所需要的功能',
    // methodNotAllowed: () => '不支持的请求方式'
}));


app.use(appFileRoutes.routes());
app.use(sysFileRoutes.routes());
app.use(Microservice.routes());

const DBWebServer = {
    run: async function () {
        let server = app.listen(port, () => {
            console.log(`SQLiteFileMana Wen服务 http://localhost:${port}`);
        });

        // 同一个端口，开启 WebSocket 服务
        const wss = new WebSocket.Server({server});
        webSocketTool.start(wss);
    }
};


module.exports = DBWebServer;
