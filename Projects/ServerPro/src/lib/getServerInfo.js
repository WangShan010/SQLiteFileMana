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
    const os = require('os');
    const { machineId, machineIdSync } = require('node-machine-id');
    function getServerInfo() {
        return {
            'arch': os.arch(),
            'PCName': os.hostname(),
            'memorySize': Math.ceil(os.totalmem() / 1024 / 1024 / 1024) + 'GB',
            'operatingSystem': os.type(),
            'CPU': os.cpus()[0].model + ' X ' + os.cpus().length,
            'machineId': machineIdSync({ original: true })
        };
    }
    return getServerInfo;
});
//# sourceMappingURL=getServerInfo.js.map