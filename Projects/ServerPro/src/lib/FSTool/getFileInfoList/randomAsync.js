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
    async function randomAsync({ filePathList, progressFunc, rootPath }) {
        let md5List = [];
        let allFileListCount = filePathList.length;
        let ProgressNumber = Math.floor(allFileListCount / 50) < 1 ? 1 : Math.floor(allFileListCount / 50);
        let reportProgress = 0;
        let psMap = new Map();
        while (filePathList.length > 0) {
            let filePath = filePathList.pop();
            psMap.set(filePath, new Promise(async (resolve) => {
                let fileInfo = await calcFileInfo(filePath, rootPath);
                if (fileInfo) {
                    md5List.push(fileInfo);
                }
                psMap.delete(filePath);
                resolve(null);
            }));
            if (psMap.size === 10) {
                await Promise.race(Array.from(psMap.values()));
            }
            else if (filePathList.length === 0) {
                await Promise.all(Array.from(psMap.values()));
            }
            reportProgress++;
            if (reportProgress === ProgressNumber) {
                reportProgress = 0;
                typeof progressFunc === 'function' && progressFunc({
                    description: '【扫描 MD5】',
                    completed: allFileListCount - filePathList.length,
                    total: allFileListCount
                });
            }
        }
        typeof progressFunc === 'function' && progressFunc({ description: '【扫描 MD5】', completed: allFileListCount, total: allFileListCount });
        return md5List;
    }
    return randomAsync;
});
//# sourceMappingURL=randomAsync.js.map