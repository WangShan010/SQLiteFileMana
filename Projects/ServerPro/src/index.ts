const Koa = require('koa');
const WS = require('ws');
const {exec} = require('child_process');
const colors = require('colors-console');

import configTool from './com/configTool.js';
import clientMiddleWare from './middleware/clientMiddleWare.js';
import manaMiddleWare from './middleware/manaMiddleWare.js';
import webSocketTool from './com/webSocketTool/webSocketTool.js';
import portIsOccupied from './lib/portIsOccupied.js';

const clientAPP = new Koa();
const manageAPP = new Koa();

async function main() {
    // cmd命令提示符/批处理/终端 快速编辑模式bug 程序运行被阻塞 顶部标题栏提示选择 需要回车或空格才能继续执行的解决方案...
    exec('reg add HKEY_CURRENT_USER\\Console /v QuickEdit /t REG_DWORD /d 00000000 /f');

    await configTool.init();
    const clientServerPort = configTool.config.clientServerPort;
    const manageServerPort = configTool.config.manageServerPort;

    // 端口占用检测
    if (clientServerPort !== await portIsOccupied(clientServerPort, false)) {
        console.log(colors('red', `================== 端口号 ${clientServerPort} 被占用，程序启动失败 ==================`));
        return;
    }
    if (manageServerPort !== await portIsOccupied(manageServerPort, false)) {
        console.log(colors('red', `================== 端口号 ${manageServerPort} 被占用，程序启动失败 ==================`));
        return;
    }


    // 【启动 HTTP Web服务器】
    await new Promise((resolve, reject) => {
        clientAPP.listen(clientServerPort, function () {
            console.log(`【启动 HTTP  Web服务器】：URL:【http://localhost:${clientServerPort}】，静态网站资源目录：【${configTool.wwwPath}】`);
            clientMiddleWare(clientAPP);
            resolve(null);
        });
    });

    // 【启动 管理员接口服务】
    await new Promise((resolve, reject) => {
        if (manageServerPort) {
            const manageServer = manageAPP.listen(manageServerPort, function () {
                console.log(`【启动 管理员接口服务】：URL:【http://localhost:${manageServerPort}】`);

                // 在同一个端口，开启 WebSocket 服务
                const wss = new WS.Server({server: manageServer});
                webSocketTool.start(wss);
                manaMiddleWare(manageAPP);
                resolve(null);
            });
        }
    });

    console.log(colors('green', `================== 服务器启动成功！当前版本：${configTool.config.version} ==================`));
}


main().then();
