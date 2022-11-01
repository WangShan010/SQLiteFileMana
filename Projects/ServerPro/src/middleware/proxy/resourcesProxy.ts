const koaStatic = require('koa-static');
const koaMount = require('koa-mount');
const path = require('path');
const configTool = require('../../com/configTool.js');

function resourcesProxy(app: any) {
    app.use(koaStatic(configTool.wwwPath), {defer: true});
    // 支持读取 app.zerossl.com 颁发的 https 证书
    app.use(koaMount('/.well-known/pki-validation', koaStatic(path.join(configTool.wwwPath, '/.well-known/pki-validation'))));
    app.use(koaMount('/cacheServer', koaStatic(path.join(configTool.appBasePath, '/temp/fileOut'))));
}


export = resourcesProxy;
