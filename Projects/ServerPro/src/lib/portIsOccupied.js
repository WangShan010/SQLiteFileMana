(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    const net = require('net');
    const colors = require('colors-console');
    async function portIsOccupied(port, log = true) {
        const server = net.createServer().listen(port);
        return new Promise((resolve, reject) => {
            server.on('listening', () => {
                log && console.log(colors('green', `您可以使用该端口： ${port}`));
                server.close();
                resolve(port);
            });
            server.on('error', async (err) => {
                if (err.code === 'EADDRINUSE') {
                    resolve(await portIsOccupied(port + 1, log));
                    log && console.log(colors('red', `端口已被占用： ${port}`));
                }
                else {
                    reject(err);
                }
            });
        });
    }
    return portIsOccupied;
});
//# sourceMappingURL=portIsOccupied.js.map