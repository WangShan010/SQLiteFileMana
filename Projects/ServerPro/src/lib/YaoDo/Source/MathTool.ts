/****************************************************************************
 名称：常用工具函数集合 - 数学类
 作者：冯功耀
 ****************************************************************************/
let MathTool = {

    // 计算数组
    calcArr(arr: number[]) {
        let min = Math.min.apply(null, arr);
        let max = Math.max.apply(null, arr);

        // 计算出平均数
        let ave = this.calcAve(arr);

        // 计算出中位数
        arr.sort(function (a, b) {
            return a - b;
        });
        let l = arr.length - 1;
        let n = Math.floor(l / 2);
        let median = (arr[n] + arr[l - n]) / 2;

        // 自然断点数
        let JenksBreaks = this.getJenksBreaks(arr, 4);
        return {arr, min, max, ave, median, JenksBreaks};
    },

    // 计算出平均数
    calcAve(arr: number[]) {
        return arr.reduce(function (a, b) {
            return a + b;
        });
    },

    // 计算出中位数
    calcMedian(arr: []) {
        // 中位数
        arr.sort(function (a, b) {
            return a - b;
        });
        let l = arr.length - 1;
        let n = Math.floor(l / 2);
        let median = (arr[n] + arr[l - n]) / 2;
        return median;
    },

    /**
     * 获取自然断点
     * @param data          []数组
     * @param numclass      个数
     * @returns {any[]}
     */
    getJenksBreaks: function (data: number[], numclass: number) {
        // 下面的算法处理 0.016 之类太小的树时，会直接爆 NAN 所以要先乘以 100 ，之后再除
        data = data.map(function (item) {
            return item * 100;
        });

        //在javascript里，Array的sort方法，必须用这个函数，否则不是按数字大小排序
        function sortNumber(a: number, b: number) {
            return a - b;
        }

        // int numclass;
        let numdata = data.length;
        data.sort(sortNumber); //先排序

        let mat1 = [];
        let mat2 = [];
        let st = [];

        for (let j = 0; j <= numdata; j++) {
            mat1[j] = [];
            mat2[j] = [];
            st[j] = 0;
            for (let i = 0; i <= numclass; i++) {
                // @ts-ignore
                mat1[j][i] = 0;
                // @ts-ignore
                mat2[j][i] = 0;
            }
        }

        for (let i = 1; i <= numclass; i++) {
            // @ts-ignore
            mat1[1][i] = 1;
            // @ts-ignore
            mat2[1][i] = 0;
            for (let j = 2; j <= numdata; j++) {
                // @ts-ignore
                mat2[j][i] = Number.MAX_VALUE;
            }
        }
        let v = 0;

        for (let l = 2; l <= numdata; l++) {
            let s1 = 0;
            let s2 = 0;
            let w = 0;
            let i3 = 0;
            for (let m = 1; m <= l; m++) {
                i3 = l - m + 1;
                let val = parseInt(String(data[i3 - 1]));

                s2 += val * val;
                s1 += val;

                w++;
                v = s2 - (s1 * s1) / w;
                let i4 = i3 - 1;
                if (i4 != 0) {
                    for (let j = 2; j <= numclass; j++) {
                        if (mat2[l][j] >= (v + mat2[i4][j - 1])) {
                            // @ts-ignore
                            mat1[l][j] = i3;
                            // @ts-ignore
                            mat2[l][j] = v + mat2[i4][j - 1];
                            if (l == 200 && j == 5) {
                                //  alert("l=" + 200 + ",j=" + 5 + ";mat2[200][5]=" + mat1[l][j] +     "i3=" + i3);
                            }
                        }
                    }
                }
            }

            // @ts-ignore
            mat1[l][1] = 1;
            // @ts-ignore
            mat2[l][1] = v;
        }

        let k = numdata;
        let kclass = [];

        kclass[numclass - 1] = parseInt(String(data[data.length - 1]));

        for (let j = numclass; j >= 2; j--) {
            let id = parseInt(mat1[k][j]) - 2;
            kclass[j - 2] = parseInt(String(data[id]));
            k = parseInt(String(mat1[k][j] - 1));
        }
        kclass = kclass.map(function (item) {
            return item / 100;
        });
        return kclass;
    },

    //阶乘，一般方法
    factorial1(sVal: number) {
        let sum = 1;
        for (let i = 1; i <= sVal; i++) {
            sum *= i;
        }
        return sum;
    },

    // 返回从 0 开始的长度为 n 的斐波那契数列
    // 创建一个指定长度的空数组, 初始化前两个值 (0和1)。使用Array.reduce()可将值添加到数组中, 方法是使用前两个值的总和, 但前两个数值除外。
    fibonacci(n: number) {
        let arr = Array(n).fill(0);
        let fibArr = arr.reduce(function (acc, val, i) {
            return [...acc, (i > 1 ? acc[i - 1] + acc[i - 2] : i)];
        }, []);
        return fibArr.pop();
    },


    // lcm：最小公倍数
    // 结合最大公约数以及Math.abs()来确定最小公约数
    lcm: (x: number, y: number) => {
        // @ts-ignore
        const gcd = (x, y) => !y ? x : gcd(y, x % y);
        return Math.abs(x * y) / (gcd(x, y));
    },

    // median: 返回数组的中间
    // 返回数组的中间，使用Array.sort()来对值进行排序，若length为奇数返回中间的数，若为偶数，返回中间两个值的平均值
    median: (arr: []) => {
        const mid = Math.floor(arr.length / 2), nums = arr.sort((a, b) => a - b);
        return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
    },


    // standardDeviation: 返回数字数组的标准偏差
    // 使用Array.reduce()计算值的平均值、方差和方差的总和, 值的方差, 然后确定标准偏差。可以省略第二个参数以获取样本标准偏差, 或将其设置为true以获取总体标准 偏差
    standardDeviation: (arr: [], usePopulation = false) => {
        const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
        // @ts-ignore
        return Math.sqrt(arr.reduce((acc, val) => [].concat(Math.pow(val - mean, 2)), []).reduce((acc, val) => acc + val,
            0) / (arr.length - (usePopulation ? 0 : 1)));
    },

    //素数
    IsPrimeNum(sVal: number) {
        for (let n = 2; n <= sVal - 1; n++) {
            if (sVal % n === 0) {
                return false;
            }
        }
        return true;
    },

    //循环分割n位数，求出每位上的数字
    spliceNum2(num: number) {
        let length = 0, temp = 0;
        let arr = [];
        let num2: number = num;
        for (; ;) {
            num2 = parseInt(String(num2 / 10));
            length++;
            if (num2 == 0) {
                break;
            }
        }
        // console.log(length);
        for (let i = length - 1; i >= 0; i--) {
            temp = num % 10;
            num = Math.floor(num / 10);
            arr[i] = temp;
        }
        return arr;
    },

    //循环分割n位数，求出每位上的数字
    spliceNum3(num: number) {
        let arr = [];
        let strnum = num.toString();
        let len = strnum.length;
        for (let i = 0; i < len; i++) {
            let temp = num % 10;
            num = parseInt(String(num / 10));
            arr.push(temp);
            if (num == 0) {
                break;
            }
        }
        return arr.reverse();
    },

    //10进制转为其他进制
    TransferTenToOther(num: number, type: string) {
        return num.toString(parseInt(type));
    },

    //把m进制的数字num转为n进制
    transfer(num: number, m: number, n: number) {
        let s = num + '';
        return parseInt(s, m).toString(n);
    },

    //求n1和n2的最大公约数，循环方法
    gys(num1: number, num2: number) {
        let min = num1 < num2 ? num1 : num2;
        for (let i = min; i >= 1; i--) {
            if (num1 % i == 0 && num2 % i == 0) {
                return i;
            }
        }
    },


    //固定范围内的随机整数
    rnd(n: number, m: number) {
        return n + Math.random() * (m - n);
    }

};


export = MathTool;
