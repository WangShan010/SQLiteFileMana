function errHandler() {
    return async (ctx, next) => {
        try {
            await next();
        } catch (error) {
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


module.exports = errHandler;
