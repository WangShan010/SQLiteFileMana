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
    let webSocketTool = {
        ws: null,
        listenMap: new Map(),
        start: function (wss) {
            let that = this;
            wss.on('connection', (ws) => {
                that.ws = ws;
                console.log('客户端连接成功！');
                ws.on('message', function (msg) {
                    that.listenMap.forEach(function (func) {
                        if (typeof func === 'function') {
                            msg = JSON.parse(msg.toString());
                            func(msg);
                        }
                    });
                });
            });
        },
        addListen: function (mark, func) {
            this.listenMap.set(mark, func);
        },
        send: function (msg) {
            if (this.ws) {
                this.ws.send(msg, (err) => {
                    if (err)
                        console.log(`服务器错误: ${err}`);
                });
            }
        }
    };
    return webSocketTool;
});
//# sourceMappingURL=webSocketTool.js.map