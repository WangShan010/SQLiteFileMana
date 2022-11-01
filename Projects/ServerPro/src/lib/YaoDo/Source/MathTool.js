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
    let MathTool = {
        calcArr(arr) {
            let min = Math.min.apply(null, arr);
            let max = Math.max.apply(null, arr);
            let ave = this.calcAve(arr);
            arr.sort(function (a, b) {
                return a - b;
            });
            let l = arr.length - 1;
            let n = Math.floor(l / 2);
            let median = (arr[n] + arr[l - n]) / 2;
            let JenksBreaks = this.getJenksBreaks(arr, 4);
            return { arr, min, max, ave, median, JenksBreaks };
        },
        calcAve(arr) {
            return arr.reduce(function (a, b) {
                return a + b;
            });
        },
        calcMedian(arr) {
            arr.sort(function (a, b) {
                return a - b;
            });
            let l = arr.length - 1;
            let n = Math.floor(l / 2);
            let median = (arr[n] + arr[l - n]) / 2;
            return median;
        },
        getJenksBreaks: function (data, numclass) {
            data = data.map(function (item) {
                return item * 100;
            });
            function sortNumber(a, b) {
                return a - b;
            }
            let numdata = data.length;
            data.sort(sortNumber);
            let mat1 = [];
            let mat2 = [];
            let st = [];
            for (let j = 0; j <= numdata; j++) {
                mat1[j] = [];
                mat2[j] = [];
                st[j] = 0;
                for (let i = 0; i <= numclass; i++) {
                    mat1[j][i] = 0;
                    mat2[j][i] = 0;
                }
            }
            for (let i = 1; i <= numclass; i++) {
                mat1[1][i] = 1;
                mat2[1][i] = 0;
                for (let j = 2; j <= numdata; j++) {
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
                                mat1[l][j] = i3;
                                mat2[l][j] = v + mat2[i4][j - 1];
                                if (l == 200 && j == 5) {
                                }
                            }
                        }
                    }
                }
                mat1[l][1] = 1;
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
        factorial1(sVal) {
            let sum = 1;
            for (let i = 1; i <= sVal; i++) {
                sum *= i;
            }
            return sum;
        },
        fibonacci(n) {
            let arr = Array(n).fill(0);
            let fibArr = arr.reduce(function (acc, val, i) {
                return [...acc, (i > 1 ? acc[i - 1] + acc[i - 2] : i)];
            }, []);
            return fibArr.pop();
        },
        lcm: (x, y) => {
            const gcd = (x, y) => !y ? x : gcd(y, x % y);
            return Math.abs(x * y) / (gcd(x, y));
        },
        median: (arr) => {
            const mid = Math.floor(arr.length / 2), nums = arr.sort((a, b) => a - b);
            return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
        },
        standardDeviation: (arr, usePopulation = false) => {
            const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
            return Math.sqrt(arr.reduce((acc, val) => [].concat(Math.pow(val - mean, 2)), []).reduce((acc, val) => acc + val, 0) / (arr.length - (usePopulation ? 0 : 1)));
        },
        IsPrimeNum(sVal) {
            for (let n = 2; n <= sVal - 1; n++) {
                if (sVal % n === 0) {
                    return false;
                }
            }
            return true;
        },
        spliceNum2(num) {
            let length = 0, temp = 0;
            let arr = [];
            let num2 = num;
            for (;;) {
                num2 = parseInt(String(num2 / 10));
                length++;
                if (num2 == 0) {
                    break;
                }
            }
            for (let i = length - 1; i >= 0; i--) {
                temp = num % 10;
                num = Math.floor(num / 10);
                arr[i] = temp;
            }
            return arr;
        },
        spliceNum3(num) {
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
        TransferTenToOther(num, type) {
            return num.toString(parseInt(type));
        },
        transfer(num, m, n) {
            let s = num + '';
            return parseInt(s, m).toString(n);
        },
        gys(num1, num2) {
            let min = num1 < num2 ? num1 : num2;
            for (let i = min; i >= 1; i--) {
                if (num1 % i == 0 && num2 % i == 0) {
                    return i;
                }
            }
        },
        rnd(n, m) {
            return n + Math.random() * (m - n);
        }
    };
    return MathTool;
});
//# sourceMappingURL=MathTool.js.map