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
    let ArrTool = {
        removeNoData(arr) {
            return arr.filter(Boolean);
        },
        getEleCount(arr, value) {
            return arr.reduce((a, v) => v === value ? a + 1 : a, 0);
        },
        difference: (a, b) => {
            const s = new Set(b);
            return a.filter(x => !s.has(x));
        },
        removeRepeat: (arr) => [...new Set(arr)],
        filterNonUnique: (arr) => arr.filter(i => arr.indexOf(i) === arr.lastIndexOf(i)),
        without: (arr, ...args) => arr.filter(v => !args.includes(v)),
        removeArrayItem(arr, item) {
            let i = 0;
            while (i < arr.length) {
                if (arr[i] === item) {
                    arr.splice(i, 1);
                }
                else {
                    i++;
                }
            }
            return arr;
        },
        upsetArr(arr) {
            let i = arr.length;
            while (i) {
                let j = Math.floor(Math.random() * i--);
                [arr[j], arr[i]] = [arr[i], arr[j]];
            }
            return arr;
        },
        sumArr(arr) {
            return arr.reduce((pre, cur) => pre + cur);
        },
        arrayAverage(arr) {
            return this.sumArr(arr) / arr.length;
        },
        randomOne(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        },
        popRandom(arr) {
            let item = this.randomOne(arr);
            this.removeArrayItem(arr, item);
            return item;
        }
    };
    return ArrTool;
});
//# sourceMappingURL=ArrTool.js.map