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
    let DateTool = {
        fullFormat(d) {
            let date = null;
            if (d instanceof Date) {
                date = d;
            }
            else if (typeof (d) === 'string') {
                date = new Date(d);
            }
            else {
                return new Date();
            }
            let str = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日${date.getHours()}时${date.getMinutes()}分${date.getSeconds()}秒${date.getMilliseconds()}毫秒`;
            return str;
        },
        simpleFormat(d) {
            let date = null;
            if (d instanceof Date) {
                date = d;
            }
            else if (typeof (d) === 'string') {
                date = new Date(d);
            }
            else {
                return new Date();
            }
            let str = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            return str;
        },
        GetDaysOfMonth(sYear, sMonth) {
            let o = new Date(sYear, sMonth, 0);
            return o.getDate();
        },
        GetWeekOfDay(sYear, sMonth, sDay) {
            let str = '';
            let date = new Date(sYear, sMonth - 1, sDay);
            switch (date.getDay()) {
                case 0:
                    str = '星期天';
                    break;
                case 1:
                    str = '星期一';
                    break;
                case 2:
                    str = '星期二';
                    break;
                case 3:
                    str = '星期三';
                    break;
                case 4:
                    str = '星期四';
                    break;
                case 5:
                    str = '星期五';
                    break;
                case 6:
                    str = '星期六';
                    break;
                default:
                    str = '输入数据不正确';
                    break;
            }
            return str;
        },
        ISODateString: (date) => {
            let pad = (n) => n < 10 ? '0' + n : n;
            return date.getUTCFullYear() + '-'
                + pad(date.getUTCMonth() + 1) + '-'
                + pad(date.getUTCDate()) + 'T'
                + pad(date.getUTCHours()) + ':'
                + pad(date.getUTCMinutes()) + ':'
                + pad(date.getUTCSeconds()) + 'Z';
        },
        GetNumOfTheDate(DateStr) {
            let d1 = new Date(DateStr);
            let d2 = new Date(d1.getTime());
            d2.setMonth(0);
            d2.setDate(1);
            let def = d1.getTime() - d2.getTime();
            return def / (1000 * 3600 * 24);
        },
        GetDayDiffBetweenDates(DateStr1, DateStr2) {
            let d1 = new Date(DateStr1);
            let d2 = new Date(DateStr2);
            let def = d1.getTime() - d2.getTime();
            return def / (1000 * 3600 * 24);
        }
    };
    let DateTutorial = {
        newDate() {
            new Date();
            new Date(2020, 10, 1);
            new Date(1000000000000);
            new Date('2018');
            new Date('2018-02');
            new Date('2018-02-19');
            new Date('2018-02-19T12:00:00');
        },
        print() {
            new Date().toUTCString();
            new Date().toDateString();
        },
        get() {
        },
        all() {
        }
    };
    return DateTool;
});
//# sourceMappingURL=DateTool.js.map