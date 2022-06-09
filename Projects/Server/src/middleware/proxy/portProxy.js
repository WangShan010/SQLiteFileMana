const Proxy = require('koa-proxy-middleware');
const configTool = require('../../com/configTool.js');

function portProxy(app) {
    let resources = configTool.config.prefixHTTPList || [];
    for (let i = 0; i < resources.length; i++) {
        const proxy = new Proxy({
            proxies: [{host: resources[i].path, context: resources[i].route.replaceAll('/', '')}]
        });
        app.use(proxy);
        console.log(`【HTTP 转发代理】：URL：【${resources[i].route}】，磁盘路径：【${resources[i].path}】`);
    }
}


module.exports = portProxy;
