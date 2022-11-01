var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../routes/AppFileRoutes.js", "../../routes/CacheRoutes.js", "../../routes/DBRoutes.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    const AppFileRoutes_js_1 = __importDefault(require("../../routes/AppFileRoutes.js"));
    const CacheRoutes_js_1 = __importDefault(require("../../routes/CacheRoutes.js"));
    const DBRoutes_js_1 = __importDefault(require("../../routes/DBRoutes.js"));
    function serverProxy(app) {
        app.use(AppFileRoutes_js_1.default.routes());
        app.use(CacheRoutes_js_1.default.routes());
        app.use(DBRoutes_js_1.default.routes());
    }
    return serverProxy;
});
//# sourceMappingURL=serverProxy.js.map