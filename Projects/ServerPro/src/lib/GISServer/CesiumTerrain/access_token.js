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
    const Cesium = require('cesium/Build/Cesium/index.cjs');
    let access_token = Cesium.Ion.defaultAccessToken;
    return access_token;
});
//# sourceMappingURL=access_token.js.map