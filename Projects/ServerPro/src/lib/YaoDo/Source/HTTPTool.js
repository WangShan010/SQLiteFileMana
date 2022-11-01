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
    let HTTPTool = {
        setCookie: function (name, value, iDay) {
            let oDate = new Date();
            oDate.setDate(oDate.getDate() + iDay);
            document.cookie = name + '=' + value + ';expires=' + oDate;
        },
        getCookie: function (name) {
            let arr = document.cookie.split('; ');
            for (let i = 0; i < arr.length; i++) {
                let arr2 = arr[i].split('=');
                if (arr2[0] === name) {
                    return arr2[1];
                }
            }
            return '';
        },
        removeCookie: function (name) {
            this.setCookie(name, '1', -1);
        },
        currentURL: () => window.location.href,
        isPc: () => !navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
    };
    return HTTPTool;
});
//# sourceMappingURL=HTTPTool.js.map