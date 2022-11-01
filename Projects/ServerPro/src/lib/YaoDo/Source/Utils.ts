/****************************************************************************
 名称：常用工具函数集合 - 其他实用函数
 版本：v-1.1.0
 作者：冯功耀
 日期：2021年2月16日
 ****************************************************************************/
let Util = {

    // speechSynthsis: 执行语音合成 (实验)
    // 使用SpeechSynthesisUtterance.voice和window.speechSynthesis.getVoices()将邮件转换为语音。
    // 使用window.speechSynthesis.speak()播放该消息。了解有关Web 语音 API 的 SpeechSynthesisUtterance 接口的详细信息
    speechSynthesis: (message: string) => {
        const msg = new SpeechSynthesisUtterance(message);
        msg.voice = window.speechSynthesis.getVoices()[0];
        window.speechSynthesis.speak(msg);
    },

    // timeTaken: 测量执行函数所用的时间
    timeTaken(callback: any, ...param: []) {
        console.time('函数耗时');
        const r = callback(...param);
        console.timeEnd('函数耗时');
        return r;
    },

    cloneMap(map: any) {
        let obj = Object.create(null);
        for (let [k, v] of map) {
            obj[k] = v;
        }
        obj = JSON.stringify(obj);
        obj = JSON.parse(obj);
        let tmpMap = new Map();
        for (let k of Object.keys(obj)) {
            tmpMap.set(k, obj[k]);
        }

        return tmpMap;
    },

    MapToJson(map: any) {
        //msp转object
        let obj = {};
        for (let [k, v] of map) {
            // @ts-ignore
            obj[k] = v;
        }

        return obj;
    },

    readFile({errFunc, endFunc}: any) {
        document.getElementById('_ef')?.remove();

        let inputObj = document.createElement('input');
        inputObj.setAttribute('id', '_ef');
        inputObj.setAttribute('type', 'file');
        inputObj.setAttribute('style', 'display:none');
        document.body.appendChild(inputObj);
        inputObj.onchange = function (d) {
            // @ts-ignore
            let file = inputObj.files[0];
            let fileName = file.name;
            let filePath = inputObj.value;
            let fileType = fileName.substring(fileName.lastIndexOf('.'));
            let reader = new FileReader();
            reader.readAsText(file, 'UTF-8');

            reader.onload = function (evt: any) {
                try {
                    let fileData = evt.target.result;
                    endFunc && endFunc({fileName, filePath, fileType, fileData});
                } catch (e) {
                    errFunc && errFunc('文件已损坏');
                }
            };
        };
        inputObj.click();
    }

};

export = Util;
