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
    const calcFileInfo = require('../calcFileInfo.js');
    async function simpleFileInfoList(filePathList, progressFunc, rootPath) {
        let md5List = [];
        let allFileListCount = filePathList.length;
        let ProgressNumber = Math.floor(allFileListCount / 50) < 1 ? 1 : Math.floor(allFileListCount / 50);
        let reportProgress = 0;
        for (let i = 0; i < allFileListCount; i++) {
            let filePath = filePathList.pop();
            let fileInfo = await calcFileInfo(filePath, rootPath);
            md5List.push(fileInfo);
            reportProgress++;
            if (reportProgress === ProgressNumber) {
                reportProgress = 0;
                typeof progressFunc === 'function' && progressFunc({
                    description: '【扫描 MD5】',
                    completed: i,
                    total: allFileListCount
                });
            }
        }
        typeof progressFunc === 'function' && progressFunc({ description: '【扫描 MD5】', completed: allFileListCount, total: allFileListCount });
        return md5List;
    }
    return simpleFileInfoList;
});
//# sourceMappingURL=simpleFileInfoList.js.map