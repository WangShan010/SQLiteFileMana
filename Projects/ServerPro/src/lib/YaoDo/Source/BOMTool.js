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
    let BOMTool = {
        GetUA: function () {
            let u = navigator.userAgent;
            return u;
        },
        toClipboard: async function (text) {
            const textarea = document.createElement('textarea');
            textarea.readOnly = true;
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            textarea.setSelectionRange(0, textarea.value.length);
            document.execCommand('Copy');
            document.body.removeChild(textarea);
        }
    };
    return BOMTool;
});
//# sourceMappingURL=BOMTool.js.map