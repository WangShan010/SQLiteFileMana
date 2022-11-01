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
    function errHandler() {
        return async (ctx, next) => {
            try {
                await next();
            }
            catch (error) {
                console.log('服务器异常', error);
                ctx.response.body = {
                    code: '00000', message: '服务器异常', desc: error.message
                };
            }
            if (parseInt(ctx.status) === 404) {
                ctx.response.body = {
                    code: '404', message: '404', desc: ctx.response.message
                };
            }
        };
    }
    return errHandler;
});
//# sourceMappingURL=errHandler.js.map