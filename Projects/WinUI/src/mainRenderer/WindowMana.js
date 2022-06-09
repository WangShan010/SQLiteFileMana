// 窗口管理器
const {BrowserWindow, globalShortcut, Menu} = require('electron');
const WebServer = require('./components/WebServer.js');


let WindowMana = {
    mainWin: null,
    createWindow: async function () {
        this.mainWin = new BrowserWindow({
            width: 1000,
            height: 600,
            resizable: false,
            webPreferences: {}
        });

        // 启动内置 Web 服务器
        await WebServer.run();

        // 载入页面
        await this.mainWin.loadFile('./src/webRenderer/index.html');
        this.initShortcut();
        Menu.setApplicationMenu(null);
    },
    openDevTools: function () {
        this.mainWin.webContents.openDevTools();
    },
    getVersion: function () {
        let arr = [];
        for (const dependency of ['chrome', 'node', 'electron']) {
            arr.push(`${dependency}-version`, process.versions[dependency]);
        }
        return arr;
    },
    initShortcut: function () {
        globalShortcut.register('ctrl+d', () => {
            WindowMana.openDevTools({mode: 'bottom'});
        });
    }
};


module.exports = WindowMana;
