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
    let StringTool = {
        trim(str, type) {
            switch (type) {
                case 1:
                    return str.replace(/\s+/g, '');
                case 2:
                    return str.replace(/(^\s*)|(\s*$)/g, '');
                case 3:
                    return str.replace(/(^\s*)/g, '');
                case 4:
                    return str.replace(/(\s*$)/g, '');
                default:
                    return str;
            }
        },
        changeCase(str, type) {
            function ToggleCase(str) {
                let itemText = '';
                str.split('').forEach(function (item) {
                    if (/^([a-z]+)/.test(item)) {
                        itemText += item.toUpperCase();
                    }
                    else if (/^([A-Z]+)/.test(item)) {
                        itemText += item.toLowerCase();
                    }
                    else {
                        itemText += item;
                    }
                });
                return itemText;
            }
            switch (type) {
                case 1:
                    return str.replace(/\b\w+\b/g, function (word) {
                        return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
                    });
                case 2:
                    return str.replace(/\b\w+\b/g, function (word) {
                        return word.substring(0, 1).toLowerCase() + word.substring(1).toUpperCase();
                    });
                case 3:
                    return ToggleCase(str);
                case 4:
                    return str.toUpperCase();
                case 5:
                    return str.toLowerCase();
                default:
                    return str;
            }
        },
        checkType(str, type) {
            switch (type) {
                case 'CardNo':
                    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str);
                case 'email':
                    return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
                case 'phone':
                    return /^1[3|4|5|7|8][0-9]{9}$/.test(str);
                case 'tel':
                    return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
                case 'number':
                    return /^[0-9]$/.test(str);
                case 'english':
                    return /^[a-zA-Z]+$/.test(str);
                case 'text':
                    return /^\w+$/.test(str);
                case 'chinese':
                    return /^[\u4E00-\u9FA5]+$/.test(str);
                case 'lower':
                    return /^[a-z]+$/.test(str);
                case 'upper':
                    return /^[A-Z]+$/.test(str);
                default:
                    return true;
            }
        },
        countStr(strA, strB) {
            return strA.split(strB).length - 1;
        },
        illegalFilter(str) {
            let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
            let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
            if (regEn.test(str) || regCn.test(str))
                return false;
            return true;
        }
    };
    return StringTool;
});
//# sourceMappingURL=StringTool.js.map