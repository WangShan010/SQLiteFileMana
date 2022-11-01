/****************************************************************************
 名称：常用工具函数集合 - 数组类
 作者：冯功耀
 ****************************************************************************/
let ArrTool = {

    // 从数组中移除  false 值 (false、null、0、""、undefined 和 NaN.
    removeNoData(arr: []) {
        return arr.filter(Boolean);
    },

    // 计算数组中值的出现次数
    getEleCount(arr: [], value: null) {
        return arr.reduce((a, v) => v === value ? a + 1 : a, 0);
    },

    // 返回两个数组的交集
    difference: (a: [], b: []) => {
        const s = new Set(b);
        return a.filter(x => !s.has(x));
    },

    // 数组去重
    removeRepeat: (arr: []) => [...new Set(arr)],

    // 筛选出数组中的非唯一值
    filterNonUnique: (arr: []) => arr.filter(i => arr.indexOf(i) === arr.lastIndexOf(i)),

    // 筛选出数组中具有指定值之一的元素
    without: (arr: [], ...args: []) => arr.filter(v => !args.includes(v)),

    // 从给定数组中移除一项
    removeArrayItem(arr: [], item: any) {
        let i = 0;
        while (i < arr.length) {
            if (arr[i] === item) {
                arr.splice(i, 1);
            } else {
                i++;
            }
        }
        return arr;
    },

    //数组顺序打乱
    upsetArr(arr: []) {
        let i = arr.length;
        while (i) {
            let j = Math.floor(Math.random() * i--);
            [arr[j], arr[i]] = [arr[i], arr[j]];
        }

        return arr;
    },

    //数组求和
    sumArr(arr: []) {
        // @ts-ignore
        return arr.reduce((pre, cur) => pre + cur);
    },

    //数组平均值
    arrayAverage(arr: []) {
        return this.sumArr(arr) / arr.length;
    },

    //从数组中随机获取元素
    randomOne(arr: []) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    // 随机弹出数组的一项
    popRandom(arr: []) {
        let item = this.randomOne(arr);
        this.removeArrayItem(arr, item);
        return item;
    }

};

export = ArrTool;
