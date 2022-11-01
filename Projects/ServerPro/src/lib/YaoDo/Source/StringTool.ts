/****************************************************************************
 名称：常用工具函数集合 - 字符串
 作者：冯功耀
 ****************************************************************************/
let StringTool = {

    /**
     * 去除空格
     * @param str
     * @param type      【1：所有空格】、【2：前后空格】、【3：前空格】【4：后空格】
     * @returns {*}
     */
    trim(str: string, type: any) {
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

    /**
     * 大小写切换
     * @param str
     * @param type 【1: 首字母大写】、【2：首字母小写】、【3：大小写转换】、【4：全部大写】、【5：全部小写】
     * @returns {string|*}
     */
    changeCase(str: string, type: any) {
        function ToggleCase(str: string) {
            let itemText = '';
            str.split('').forEach(
                function (item) {
                    if (/^([a-z]+)/.test(item)) {
                        itemText += item.toUpperCase();
                    } else if (/^([A-Z]+)/.test(item)) {
                        itemText += item.toLowerCase();
                    } else {
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

    //检测字符串
    checkType(str: string, type: any) {
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

    //查找 strA 出现在 strB 里的次数
    countStr(strA: string, strB: string) {
        return strA.split(strB).length - 1;
    },

    //过滤非法字符串
    illegalFilter(str: string) {
        let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
        let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

        if (regEn.test(str) || regCn.test(str)) return false;
        return true;
    }
};

export = StringTool;
