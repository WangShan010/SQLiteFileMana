const http = require('http');
const FileSystem = require('./FileSystem.js');
const url = require('url');
const hostname = '127.0.0.1';
const port = 3002;
let server = http.createServer();

let WebServer = {
    Routes: async function () {
        server.on('request', async function (req, res) {

            let params = url.parse(req.url, true).query;
            let reqUrl = url.parse(req.url, true).pathname;

            // 开启跨域
            res.setHeader('Access-Control-Allow-Origin', '*');

            let state;
            switch (reqUrl) {
                case '/sysFile/choosePath':
                    let choosePath = await FileSystem.choosePathDialog();
                    state = choosePath ? 200 : 500;
                    res.writeHead(state, {'Content-Type': 'application/json;charset=utf-8'});
                    res.write(JSON.stringify({path: choosePath}));
                    res.end();
                    break;
                case '/sysFile/openCatalogue':
                    let pathToOpen = params.path;
                    if (pathToOpen) {
                        await FileSystem.openCatalogue(pathToOpen);
                        state = 200;
                        res.writeHead(state, {'Content-Type': 'application/json;charset=utf-8'});
                        res.write(JSON.stringify({path: pathToOpen}));
                    } else {
                        state = 500;
                        res.writeHead(state, {'Content-Type': 'application/json;charset=utf-8'});
                        res.write(JSON.stringify({path: 'Error'}));
                    }
                    res.end();
                    break;
            }
        });
    }, run: async function () {
        await this.Routes();
        server.listen(port, hostname, () => {
            console.log(`服务器运行在 http://${hostname}:${port}/`);
        });
    }
};


module.exports = WebServer;
