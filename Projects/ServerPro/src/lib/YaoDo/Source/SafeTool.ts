/****************************************************************************
 名称：常用工具函数集合 - 安全类
 作者：冯功耀
 ****************************************************************************/
let SafeTool = {
    /**
     * 生成随机字符串(可指定长度)
     * @param len
     * @returns {string}
     */
    randomString(len: number) {
        len = len || 8;
        let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        let maxPos = $chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },

    /**
     * 生成UUID
     * @returns {string}
     */
    generateUUID() {
        let d = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    },

    //检测密码强度
    checkPwd: function (str: string) {
        let nowLv = 0;
        if (str.length < 6) {
            return nowLv;
        }
        if (/[0-9]/.test(str)) {
            nowLv++;
        }
        if (/[a-z]/.test(str)) {
            nowLv++;
        }
        if (/[A-Z]/.test(str)) {
            nowLv++;
        }
        if (/[\.|-|_]/.test(str)) {
            nowLv++;
        }
        return nowLv;
    }
};

export = SafeTool;
