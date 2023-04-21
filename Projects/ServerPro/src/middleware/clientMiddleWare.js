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
    const cors = require('koa2-cors');
    const compress = require('koa-compress');
    const bodyParser = require('koa-bodyparser');
    const resourcesProxy = require('./proxy/resourcesProxy.js');
    const portProxy = require('./proxy/portProxy.js');
    const errHandler = require('./lib/errHandler.js');
    const appFileRoutes = require('../routes/AppFileRoutes.js');
    const cacheRoutes = require('../routes/CacheRoutes.js');
    const DBRoutes = require('../routes/DBRoutes.js');
    const EncryptRoutes = require('../routes/EncryptRoutes.js');
    const configTool = require('../com/configTool.js');
    function clientMiddleWare(app) {
        app.use(errHandler());
        configTool.config.clientCORS && app.use(cors());
        app.use(compress({ br: false }));
        resourcesProxy(app);
        portProxy(app);
        app.use(bodyParser());
        configTool.config.CacheSave.state && app.use(cacheRoutes.routes());
        app.use(appFileRoutes.routes());
        app.use(DBRoutes.routes());
        app.use(EncryptRoutes.routes());
    }
    return clientMiddleWare;
});
//# sourceMappingURL=clientMiddleWare.js.map