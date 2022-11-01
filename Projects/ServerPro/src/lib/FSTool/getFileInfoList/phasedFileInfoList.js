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
    async function phasedFileInfoList({ filePathList, phasedFunc, progressFunc, rootPath }) {
        let mainMaxMemory = 100 << 10;
        let mainBufferTotal = 0;
        let allFileListCount = filePathList.length;
        let index = 0;
        let ProgressNumber = Math.floor(allFileListCount / 25) < 1 ? 1 : Math.floor(allFileListCount / 25);
        let reportProgress = 0;
        let md5List = [];
        while (filePathList.length > 0) {
            let filePath = filePathList.pop();
            let fileInfo = await calcFileInfo(filePath, rootPath);
            md5List.push(fileInfo);
            mainBufferTotal += fileInfo.size;
            index++;
            reportProgress++;
            if (reportProgress === ProgressNumber) {
                reportProgress = 0;
                typeof progressFunc === 'function' && progressFunc({ description: '【单线程、100MB 内存设阈值，扫描 MD5】', completed: index, total: allFileListCount });
            }
            if (mainBufferTotal > mainMaxMemory && typeof phasedFunc === 'function') {
                mainBufferTotal = 0;
                await phasedFunc(md5List);
                md5List.length = 0;
            }
        }
        typeof progressFunc === 'function' && progressFunc({ description: '【单线程、100MB 内存设阈值，扫描 MD5】', completed: index, total: allFileListCount });
        if (typeof phasedFunc === 'function') {
            await phasedFunc(md5List);
            md5List.length = 0;
        }
        return md5List;
    }
    return phasedFileInfoList;
});
//# sourceMappingURL=phasedFileInfoList.js.map