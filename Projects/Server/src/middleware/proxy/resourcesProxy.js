const koaStatic = require('koa-static');
const koaMount = require('koa-mount');
const path = require('path');
const configTool = require('../../com/configTool.js');

function resourcesProxy(app) {
    app.use(koaStatic(configTool.wwwPath), {defer: true});
    app.use(koaMount('/cacheServer', koaStatic(path.join(configTool.appBasePath, '/temp/fileOut'))));
}


module.exports = resourcesProxy;
