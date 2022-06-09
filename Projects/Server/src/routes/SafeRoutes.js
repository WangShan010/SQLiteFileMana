const router = require('koa-router');
const JWT = require('../lib/JWT.js');

const SafeRoutes = new router({prefix: '/safe'});

// 通配符的写法
SafeRoutes
    // 验证 Token 的有效性
    .get('/verifyToken', async (ctx) => {
        const token = ctx.params.SFM_token;
        return await JWT.verifyToken(token);
    })
    // 颁发给临时访客的一个 Token，有效期为 1 天
    .get('/getVisitorToken', async (ctx, next) => {
        ctx.set('Content-Type', 'application/json;charset=utf-8');
        let token = await JWT.generateToken('visitor');
        ctx.body = JSON.stringify({token, message: '系统发放的资源访问电子令牌，有效期为一天'});
    })
    // 给正式用户发放 Token
    .get('/getUserToken', async (ctx, next) => {
        ctx.body = 404;
    });


module.exports = SafeRoutes;
