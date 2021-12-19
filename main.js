// app 模块，它控制应用程序的事件生命周期。
// BrowserWindow 模块，它创建和管理应用程序 窗口。
const {app, BrowserWindow} = require('electron');
const WindowMana = require('./src/mainRenderer/WindowMana.js');

// 开发过程中，程序热刷新。导致页面，特别卡顿
// require('electron-reloader')(module, {});


async function main() {
    // 当 Linux 和 Windows 应用在没有窗口打开时退出了，macOS 应用通常即使在没有打开任何窗口的情况下也继续运行，并且在没有窗口可用的情况下激活应用时会打开新的窗口。
    await app.whenReady();
    await WindowMana.createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) WindowMana.createWindow();
    });


    // 在Windows和Linux上，关闭所有窗口通常会完全退出一个应用程序。
    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
}


main().then();


