/****************************************************************************
 名称：常用工具函数集合 - 日期类
 作者：冯功耀
 ****************************************************************************/
let DateTool = {
    /**
     * 日期格式化
     * @param d
     * @returns {string|null}
     * @constructor
     */
    fullFormat(d: string | number | Date) {
        let date = null;
        if (d instanceof Date) {
            date = d;
        } else if (typeof (d) === 'string') {
            date = new Date(d);
        } else {
            return new Date();
        }
        let str = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日${date.getHours()}时${date.getMinutes()}分${date.getSeconds()}秒${date.getMilliseconds()}毫秒`;
        return str;
    },

    simpleFormat(d: string | number | Date) {
        let date = null;
        if (d instanceof Date) {
            date = d;
        } else if (typeof (d) === 'string') {
            date = new Date(d);
        } else {
            return new Date();
        }
        let str = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        return str;
    },

    // 获取指定月份的天数
    GetDaysOfMonth(sYear: number, sMonth: number) {
        let o = new Date(sYear, sMonth, 0);
        return o.getDate();
    },

    //获取某天是星期几
    GetWeekOfDay(sYear: number, sMonth: number, sDay: number | undefined) {
        let str = '';
        let date = new Date(sYear, sMonth - 1, sDay);
        switch (date.getDay()) { //getDay()返回是0-6
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

    // ISODateString: 将本地日期格式转换为 ISO 日期
    ISODateString: (date: Date) => {
        let pad = (n: string | number) => n < 10 ? '0' + n : n;
        return date.getUTCFullYear() + '-'
            + pad(date.getUTCMonth() + 1) + '-'
            + pad(date.getUTCDate()) + 'T'
            + pad(date.getUTCHours()) + ':'
            + pad(date.getUTCMinutes()) + ':'
            + pad(date.getUTCSeconds()) + 'Z';
    },

    // 获取年积日
    GetNumOfTheDate(DateStr: string | Date) {
        let d1 = new Date(DateStr);
        let d2 = new Date(d1.getTime());
        d2.setMonth(0);
        d2.setDate(1);
        let def = d1.getTime() - d2.getTime();
        return def / (1000 * 3600 * 24);
    },

    // 返回两个日期的 天数差
    GetDayDiffBetweenDates(DateStr1: string | Date, DateStr2: string | Date) {
        let d1 = new Date(DateStr1);
        let d2 = new Date(DateStr2);
        let def = d1.getTime() - d2.getTime();
        return def / (1000 * 3600 * 24);
    }
};

// 有关 JavaScript Date 的说明教程
let DateTutorial = {

    // 有 4 种方法创建新的日期对象：
    newDate() {
        new Date();
        // Node 环境下：【 2021-02-16T03:37:33.471Z 】
        // 浏览器环境下：【 Date Tue Feb 16 2021 11:37:46 GMT+0800 (中国标准时间) 】
        // 注意：直接 console.log() 打印出来的东西长得不一样
        //      但是 .toString()   后就可以统一了

        // new Date(year, month, day, hours, minutes, seconds, milliseconds);
        // 注意：注释：JavaScript 从 0 到 11 计算月份。
        new Date(2020, 10, 1);
        // Date Wed Aug 12 2020 08:00:00 GMT+0800 (中国标准时间)
        // 格式化后："2020年 11月 1日 0时 0分 0秒 0毫秒"

        // new Date(milliseconds);
        // 1970年 1 月 1 日加上1 0000 0000 0000毫秒，大约是 2001 年 9 月 09 日：
        new Date(1000000000000);

        // new Date(date string);
        // 警告：在某些浏览器中，不带前导零的月或其会产生错误
        // ISO 8601 语法 (YYYY-MM-DD) 也是首选的 JavaScript 日期格式：
        new Date('2018');
        new Date('2018-02');
        new Date('2018-02-19');
        // "2018年 2月 19日 8时 0分 0秒 0毫秒"，因为中国是东八区，多8个小时

        // 日期和时间通过大写字母 T 来分隔。
        new Date('2018-02-19T12:00:00');

    },

    print() {
        // Tue, 16 Feb 2021 03:56:01 GMT
        new Date().toUTCString();

        // Tue Feb 16 2021
        new Date().toDateString();
    },
    get() {
        // getDate() 	        以数值返回天（1-31）
        // getDay() 	        以数值获取周名（0-6）
        // getFullYear() 	    获取四位的年（yyyy）
        // getHours() 	        获取小时（0-23）
        // getMilliseconds() 	获取毫秒（0-999）
        // getMinutes() 	    获取分（0-59）
        // getMonth() 	        获取月（0-11）
        // getSeconds() 	    获取秒（0-59）
        // getTime() 	        获取时间（从 1970 年 1 月 1 日至今）
    },
    all() {
        // Date() 	返回当日的日期和时间。
        // getDate() 	从 Date 对象返回一个月中的某一天 (1 ~ 31)。
        // getDay() 	从 Date 对象返回一周中的某一天 (0 ~ 6)。
        // getMonth() 	从 Date 对象返回月份 (0 ~ 11)。
        // getFullYear() 	从 Date 对象以四位数字返回年份。
        // getYear() 	请使用 getFullYear() 方法代替。
        // getHours() 	返回 Date 对象的小时 (0 ~ 23)。
        // getMinutes() 	返回 Date 对象的分钟 (0 ~ 59)。
        // getSeconds() 	返回 Date 对象的秒数 (0 ~ 59)。
        // getMilliseconds() 	返回 Date 对象的毫秒(0 ~ 999)。
        // getTime() 	返回 1970 年 1 月 1 日至今的毫秒数。
        // getTimezoneOffset() 	返回本地时间与格林威治标准时间 (GMT) 的分钟差。
        // getUTCDate() 	根据世界时从 Date 对象返回月中的一天 (1 ~ 31)。
        // getUTCDay() 	根据世界时从 Date 对象返回周中的一天 (0 ~ 6)。
        // getUTCMonth() 	根据世界时从 Date 对象返回月份 (0 ~ 11)。
        // getUTCFullYear() 	根据世界时从 Date 对象返回四位数的年份。
        // getUTCHours() 	根据世界时返回 Date 对象的小时 (0 ~ 23)。
        // getUTCMinutes() 	根据世界时返回 Date 对象的分钟 (0 ~ 59)。
        // getUTCSeconds() 	根据世界时返回 Date 对象的秒钟 (0 ~ 59)。
        // getUTCMilliseconds() 	根据世界时返回 Date 对象的毫秒(0 ~ 999)。
        // parse() 	返回1970年1月1日午夜到指定日期（字符串）的毫秒数。
        // setDate() 	设置 Date 对象中月的某一天 (1 ~ 31)。
        // setMonth() 	设置 Date 对象中月份 (0 ~ 11)。
        // setFullYear() 	设置 Date 对象中的年份（四位数字）。
        // setYear() 	请使用 setFullYear() 方法代替。
        // setHours() 	设置 Date 对象中的小时 (0 ~ 23)。
        // setMinutes() 	设置 Date 对象中的分钟 (0 ~ 59)。
        // setSeconds() 	设置 Date 对象中的秒钟 (0 ~ 59)。
        // setMilliseconds() 	设置 Date 对象中的毫秒 (0 ~ 999)。
        // setTime() 	以毫秒设置 Date 对象。
        // setUTCDate() 	根据世界时设置 Date 对象中月份的一天 (1 ~ 31)。
        // setUTCMonth() 	根据世界时设置 Date 对象中的月份 (0 ~ 11)。
        // setUTCFullYear() 	根据世界时设置 Date 对象中的年份（四位数字）。
        // setUTCHours() 	根据世界时设置 Date 对象中的小时 (0 ~ 23)。
        // setUTCMinutes() 	根据世界时设置 Date 对象中的分钟 (0 ~ 59)。
        // setUTCSeconds() 	根据世界时设置 Date 对象中的秒钟 (0 ~ 59)。
        // setUTCMilliseconds() 	根据世界时设置 Date 对象中的毫秒 (0 ~ 999)。
        // toString() 	把 Date 对象转换为字符串。
        // toTimeString() 	把 Date 对象的时间部分转换为字符串。
        // toDateString() 	把 Date 对象的日期部分转换为字符串。
        // toGMTString() 	请使用 toUTCString() 方法代替。
        // toUTCString() 	根据世界时，把 Date 对象转换为字符串。
        // toLocaleString() 	根据本地时间格式，把 Date 对象转换为字符串。
        // toLocaleTimeString() 	根据本地时间格式，把 Date 对象的时间部分转换为字符串。
        // toLocaleDateString() 	根据本地时间格式，把 Date 对象的日期部分转换为字符串。
        // UTC() 	根据世界时返回 1970 年 1 月 1 日 到指定日期的毫秒数。
        // valueOf() 	返回 Date 对象的原始值。
    }

};

export = DateTool;
