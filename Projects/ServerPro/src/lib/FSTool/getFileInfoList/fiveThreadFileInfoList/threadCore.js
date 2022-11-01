"use strict";
const calcFileInfo = require('../../calcFileInfo.js');
async function popData(fileInfoList) {
    process.send({ message: 'popData', data: fileInfoList });
}
process.on('message', async function ({ threadPathList, rootPath }) {
    let maxMemory = 50 << 10;
    let md5List = [];
    let ProgressNumber = Math.floor(threadPathList.length / 10);
    let reportProgress = 0;
    let bufferTotal = 0;
    let count = threadPathList.length;
    for (let i = 0; i < count; i++) {
        let filePath = threadPathList[i];
        let fileInfo = await calcFileInfo(filePath, rootPath);
        md5List.push(fileInfo);
        reportProgress++;
        if (reportProgress === ProgressNumber) {
            reportProgress = 0;
            process.send({ message: 'Progress', data: ProgressNumber });
        }
        bufferTotal += fileInfo.size;
        if (typeof maxMemory === 'number' && bufferTotal > maxMemory) {
            bufferTotal = 0;
            await popData(md5List);
            md5List.length = 0;
        }
    }
    await popData(md5List);
    threadPathList.length = 0;
    md5List.length = 0;
    process.send({ message: 'Progress', data: reportProgress });
    process.send({ message: 'Complete', data: [] });
});
//# sourceMappingURL=threadCore.js.map