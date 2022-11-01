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
    const configTool = require('../../../com/configTool.js');
    const simpleFileInfoList = require('./simpleFileInfoList.js');
    const randomAsync = require('./randomAsync.js');
    const phasedFileInfoList = require('./phasedFileInfoList.js');
    const fiveThreadFileInfoList = require('./fiveThreadFileInfoList/index.js');
    async function getFileInfoList({ filePathList, mode, phasedFunc, progressFunc, rootPath }) {
        await configTool.init();
        filePathList = filePathList || [];
        if (!mode && filePathList.length < 5000) {
            mode = 'simple';
        }
        else if (!mode && filePathList.length < 10000) {
            mode = 'phased';
        }
        else if (!mode) {
            mode = 'fiveThread';
        }
        phasedFunc = phasedFunc || null;
        progressFunc = progressFunc || null;
        rootPath = rootPath || '';
        let fileInfoList = [];
        switch (mode) {
            case 'simple':
                fileInfoList = await simpleFileInfoList(filePathList, progressFunc, rootPath);
                break;
            case 'phased':
                fileInfoList = await phasedFileInfoList({ filePathList, phasedFunc, progressFunc, rootPath });
                break;
            case 'fiveThread':
                fileInfoList = await fiveThreadFileInfoList(filePathList, phasedFunc, progressFunc, rootPath);
                break;
            case 'randomAsync':
                fileInfoList = await randomAsync({ filePathList, progressFunc, rootPath });
                break;
        }
        return fileInfoList;
    }
    return getFileInfoList;
});
//# sourceMappingURL=index.js.map