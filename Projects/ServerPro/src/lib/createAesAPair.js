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
    let NodeRSA = require('node-rsa');
    function createAesAPair(b = 1024) {
        const key = new NodeRSA({ b });
        const publicDer = key.exportKey('pkcs8-public-pem');
        const privateDer = key.exportKey('pkcs8-private-pem');
        return { privateDer, publicDer };
    }
    return createAesAPair;
});
//# sourceMappingURL=createAesAPair.js.map