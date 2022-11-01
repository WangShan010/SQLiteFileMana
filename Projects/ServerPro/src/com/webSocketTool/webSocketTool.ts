let webSocketTool = {
    ws: null as any,               // 只允许一个客户端连接
    listenMap: new Map(),
    // 启动服务
    start: function (wss: any) {
        let that = this;
        wss.on('connection', (ws: any) => {
            that.ws = ws;
            console.log('客户端连接成功！');

            // 接收到数据，触发监听
            ws.on('message', function (msg: string) {
                that.listenMap.forEach(function (func: Function) {
                    if (typeof func === 'function') {
                        msg = JSON.parse(msg.toString());
                        func(msg);
                    }
                });

            });
        });
    },
    // 添加监听，监听客户端传给后台的数据
    addListen: function (mark: any, func: any) {
        this.listenMap.set(mark, func);
    },
    // 向客户端发生消息
    send: function (msg: string) {
        if (this.ws) {
            this.ws.send(msg, (err: any) => {
                if (err) console.log(`服务器错误: ${err}`);
            });
        }
    }
};


export = webSocketTool;
