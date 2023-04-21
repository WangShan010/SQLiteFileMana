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
    const koaStatic = require('koa-static');
    const koaMount = require('koa-mount');
    const path = require('path');
    const configTool = require('../../com/configTool.js');
    function resourcesProxy(app) {
        console.log('configTool.wwwPath: ' + configTool.wwwPath);
        app.use(koaStatic(configTool.wwwPath), { defer: true });
        app.use(koaMount('/.well-known/pki-validation', koaStatic(path.join(configTool.wwwPath, '/.well-known/pki-validation'))));
        app.use(koaMount('/cacheServer', koaStatic(path.join(configTool.appBasePath, '/temp/fileOut'))));
    }
    return resourcesProxy;
});
//# sourceMappingURL=resourcesProxy.js.map