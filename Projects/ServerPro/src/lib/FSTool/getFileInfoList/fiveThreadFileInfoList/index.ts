const cp = require('child_process');
const path = require('path');


// 开启 4 个进程来并行计算 文件数组 的 MD5
async function fiveThreadFileInfoList(filePathList: string[], phasedFunc: Function, progressFunc: Function, rootPath: string) {

    let optionObj = {
        rootPath, index: 0, progressLength: filePathList.length
    };

    // 开启多线程解析文件列表，将解析成果暂时放入 缓存文件中
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

// 创建计算 MD5 的进程
function creatThread(threadName: string, threadPathList: any[], phasedFunc: Function, progressFunc: Function, optionObj: any = {}) {
    let fileInfoList: any[] = [];
    return new Promise(function (resolve) {
        // 创建子进程
        let n = cp.fork(path.join(__dirname, './threadCore.js'));

        // 向子进程发送数据
        n.send({threadName, threadPathList, rootPath: optionObj.rootPath});

        n.on('message', function (reData: any) {
            let message = reData.message;
            switch (message) {
                case 'popData': {
                    let list = reData.data;
                    list.map((fileInfo: any) => {
                        fileInfo.buffer = Buffer.from(fileInfo.buffer);
                    });
                    typeof phasedFunc === 'function' && phasedFunc(list);
                    for (let i = 0; i < list.length; i++) {
                        fileInfoList.push(list[i]);
                    }
                }
                    break;
                case 'Progress': {
                    optionObj.index += reData.data;
                    typeof progressFunc === 'function' && progressFunc({
                        description: '【开启 5 进程扫描 MD5】',
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


// 把完整数组分成 coreNum 份，数组平分
function group(array: any[], subNum: number) {
    let part = (array.length / subNum) + 1;
    let newArray = [];
    for (let i = 0; i < subNum; i++) {
        newArray.push(array.slice(i * part, (i + 1) * part));
    }

    return newArray;
}

export = fiveThreadFileInfoList;

