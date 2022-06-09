const Koa = require('koa');
const WebSocket = require('ws');
const configTool = require('./com/configTool.js');
const clientMiddleWare = require('./middleware/clientMiddleWare.js');
const manaMiddleWare = require('./middleware/manaMiddleWare.js');
const webSocketTool = require('./com/webSocketTool/webSocketTool.js');
const {exec} = require('child_process');

const clientAPP = new Koa();
const manageAPP = new Koa();

async function main() {
    // cmd命令提示符/批处理/终端 快速编辑模式bug 程序运行被阻塞 顶部标题栏提示选择 需要回车或空格才能继续执行的解决方案...
    exec('reg add HKEY_CURRENT_USER\\Console /v QuickEdit /t REG_DWORD /d 00000000 /f');

    await configTool.init();
    const clientServerPort = configTool.config.clientServerPort;
    const manageServerPort = configTool.config.manageServerPort;


    const clientServer = clientAPP.listen(clientServerPort, function () {
        console.log(`【启动Web服务器】：URL:【http://localhost:${clientServerPort}】，磁盘路径：【${configTool.wwwPath}】`);
        clientMiddleWare(clientAPP);
        console.log(`========================服务器启动成功！========================`);
    });


    const manageServer = manageAPP.listen(manageServerPort, function () {
        manaMiddleWare(manageAPP);
    });
    // 在同一个端口，开启 WebSocket 服务
    const wss = new WebSocket.Server({server: manageServer});
    webSocketTool.start(wss);
}


main().then();
