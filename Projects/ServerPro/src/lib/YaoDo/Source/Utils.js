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
    let Util = {
        speechSynthesis: (message) => {
            const msg = new SpeechSynthesisUtterance(message);
            msg.voice = window.speechSynthesis.getVoices()[0];
            window.speechSynthesis.speak(msg);
        },
        timeTaken(callback, ...param) {
            console.time('函数耗时');
            const r = callback(...param);
            console.timeEnd('函数耗时');
            return r;
        },
        cloneMap(map) {
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
        MapToJson(map) {
            let obj = {};
            for (let [k, v] of map) {
                obj[k] = v;
            }
            return obj;
        },
        readFile({ errFunc, endFunc }) {
            document.getElementById('_ef')?.remove();
            let inputObj = document.createElement('input');
            inputObj.setAttribute('id', '_ef');
            inputObj.setAttribute('type', 'file');
            inputObj.setAttribute('style', 'display:none');
            document.body.appendChild(inputObj);
            inputObj.onchange = function (d) {
                let file = inputObj.files[0];
                let fileName = file.name;
                let filePath = inputObj.value;
                let fileType = fileName.substring(fileName.lastIndexOf('.'));
                let reader = new FileReader();
                reader.readAsText(file, 'UTF-8');
                reader.onload = function (evt) {
                    try {
                        let fileData = evt.target.result;
                        endFunc && endFunc({ fileName, filePath, fileType, fileData });
                    }
                    catch (e) {
                        errFunc && errFunc('文件已损坏');
                    }
                };
            };
            inputObj.click();
        }
    };
    return Util;
});
//# sourceMappingURL=Utils.js.map