var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./com/configTool.js", "./middleware/clientMiddleWare.js", "./middleware/manaMiddleWare.js", "./com/webSocketTool/webSocketTool.js", "./lib/portIsOccupied.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Koa = require('koa');
    const WS = require('ws');
    const { exec } = require('child_process');
    const colors = require('colors-console');
    const configTool_js_1 = __importDefault(require("./com/configTool.js"));
    const clientMiddleWare_js_1 = __importDefault(require("./middleware/clientMiddleWare.js"));
    const manaMiddleWare_js_1 = __importDefault(require("./middleware/manaMiddleWare.js"));
    const webSocketTool_js_1 = __importDefault(require("./com/webSocketTool/webSocketTool.js"));
    const portIsOccupied_js_1 = __importDefault(require("./lib/portIsOccupied.js"));
    const clientAPP = new Koa();
    const manageAPP = new Koa();
    async function main() {
        exec('reg add HKEY_CURRENT_USER\\Console /v QuickEdit /t REG_DWORD /d 00000000 /f');
        await configTool_js_1.default.init();
        const clientServerPort = configTool_js_1.default.config.clientServerPort;
        const manageServerPort = configTool_js_1.default.config.manageServerPort;
        if (clientServerPort !== await (0, portIsOccupied_js_1.default)(clientServerPort, false)) {
            console.log(colors('red', `================== 端口号 ${clientServerPort} 被占用，程序启动失败 ==================`));
            return;
        }
        if (manageServerPort !== await (0, portIsOccupied_js_1.default)(manageServerPort, false)) {
            console.log(colors('red', `================== 端口号 ${manageServerPort} 被占用，程序启动失败 ==================`));
            return;
        }
        await new Promise((resolve, reject) => {
            clientAPP.listen(clientServerPort, function () {
                console.log(`【启动 HTTP  Web服务器】：URL:【http://localhost:${clientServerPort}】，静态网站资源目录：【${configTool_js_1.default.wwwPath}】`);
                (0, clientMiddleWare_js_1.default)(clientAPP);
                resolve(null);
            });
        });
        await new Promise((resolve, reject) => {
            if (manageServerPort) {
                const manageServer = manageAPP.listen(manageServerPort, function () {
                    console.log(`【启动 管理员接口服务】：URL:【http://localhost:${manageServerPort}】`);
                    const wss = new WS.Server({ server: manageServer });
                    webSocketTool_js_1.default.start(wss);
                    (0, manaMiddleWare_js_1.default)(manageAPP);
                    resolve(null);
                });
            }
        });
        console.log(colors('green', `================== 服务器启动成功！当前版本：${configTool_js_1.default.config.version} ==================`));
    }
    main().then();
});
//# sourceMappingURL=index.js.map