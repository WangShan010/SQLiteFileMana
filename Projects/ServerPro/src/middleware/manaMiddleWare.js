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
    const errHandler = require('./lib/errHandler');
    const cors = require('koa2-cors');
    const bodyParser = require('koa-bodyparser');
    const ManaRoutes = require('../routes/ManaRoutes.js');
    function manaMiddleWare(app) {
        app.use(errHandler());
        app.use(cors());
        app.use(bodyParser());
        app.use(ManaRoutes.routes());
    }
    return manaMiddleWare;
});
//# sourceMappingURL=manaMiddleWare.js.map