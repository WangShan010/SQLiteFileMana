const jwt = require('jsonwebtoken');
const configTool = require('../com/configTool.js');

let JWT = {
    // 为合法的用户信息生成 token
    async generateToken(user = 'admin', timeout = 60 * 60 * 24) {
        await configTool.init();

        let created = Math.floor(Date.now() / 1000);
        let cert = configTool.config.privateDer;
        return jwt.sign({user, exp: created + timeout}, cert, {algorithm: 'RS256'});
    },
    // 校验token
    async verifyToken(token) {
        await configTool.init();
        let cert = configTool.config.publicDer;
        let res = {};

        try {
            res = jwt.verify(token, cert, {algorithms: ['RS256']});
            res.state = 'allRight';
        } catch (e) {
            res.state = 'err';
        }
        return res;
    }
};

module.exports = JWT;