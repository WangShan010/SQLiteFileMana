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
    const cp = require('child_process');
    const path = require('path');
    async function fiveThreadFileInfoList(filePathList, phasedFunc, progressFunc, rootPath) {
        let optionObj = {
            rootPath, index: 0, progressLength: filePathList.length
        };
        let [batch1, batch2, batch3, batch4, batch5] = group(filePathList, 5);
        let resData = await Promise.all([
            creatThread('线程1', batch1, phasedFunc, progressFunc, optionObj),
            creatThread('线程2', batch2, phasedFunc, progressFunc, optionObj),
            creatThread('线程3', batch3, phasedFunc, progressFunc, optionObj),
            creatThread('线程4', batch4, phasedFunc, progressFunc, optionObj),
            creatThread('线程5', batch5, phasedFunc, progressFunc, optionObj)
        ]);
        return resData.flat(2);
    }
    function creatThread(threadName, threadPathList, phasedFunc, progressFunc, optionObj = {}) {
        let fileInfoList = [];
        return new Promise(function (resolve) {
            let n = cp.fork(path.join(__dirname, './threadCore.js'));
            n.send({ threadName, threadPathList, rootPath: optionObj.rootPath });
            n.on('message', function (reData) {
                let message = reData.message;
                switch (message) {
                    case 'popData':
                        {
                            let list = reData.data;
                            list.map((fileInfo) => {
                                fileInfo.buffer = Buffer.from(fileInfo.buffer);
                            });
                            typeof phasedFunc === 'function' && phasedFunc(list);
                            for (let i = 0; i < list.length; i++) {
                                fileInfoList.push(list[i]);
                            }
                        }
                        break;
                    case 'Progress':
                        {
                            optionObj.index += reData.data;
                            typeof progressFunc === 'function' && progressFunc({
                                description: '【开启 4 进程扫描 MD5】',
                                completed: optionObj.index,
                                total: optionObj.progressLength
                            });
                        }
                        break;
                    case 'Complete': {
                        resolve(fileInfoList);
                        n.disconnect();
                    }
                }
            });
        });
    }
    function group(array, subNum) {
        let part = (array.length / subNum) + 1;
        let newArray = [];
        for (let i = 0; i < subNum; i++) {
            newArray.push(array.slice(i * part, (i + 1) * part));
        }
        return newArray;
    }
    return fiveThreadFileInfoList;
});
//# sourceMappingURL=index.js.map