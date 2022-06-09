let webSocketTool = {
    ws: null,               // 只允许一个客户端连接
    listenMap: new Map()
};

// 启动服务
webSocketTool.start = function (wss) {
    let that = this;
    wss.on("connection", ws => {
        that.ws = ws;
        console.log('客户端连接成功！');

        // 接收到数据，触发监听
        ws.on("message", function (msg) {
            for (const [key, func] of that.listenMap) {
                if (typeof func === "function") {
                    msg = JSON.parse(msg.toString());
                    func(msg);
                }
            }
        });
    });
};

// 添加监听，监听客户端传给后台的数据
webSocketTool.addListen = function (mark, func) {
    this.listenMap.set(mark, func);
};

// 向客户端发生消息
webSocketTool.send = function (msg) {
    if (this.ws) {
        this.ws.send(msg, err => {
            if (err) console.log(`服务器错误: ${err}`);
        });
    }
};


module.exports = webSocketTool;
