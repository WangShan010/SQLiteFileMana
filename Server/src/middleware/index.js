const cors = require('koa2-cors');
const logger = require('koa-logger');
const Moment = require('moment');
const compress = require('koa-compress');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const koaStatic = require('koa-static');
const configTool = require('../lib/configTool.js');
const appFileRoutes = require('../routes/appFileRoutes.js');
const sysFileRoutes = require('../routes/sysFileRoutes.js');
const microService = require('../routes/microService.js');

require('../com/WeaterCrawler/index.js')


function loadMiddleWare(app) {
    app.use(cors());
    app.use(logger(str => {
        // console.log(Moment().format('YYYY-MM-DD HH:mm:ss') + str);
    }));
    app.use(compress());
    app.use(bodyParser());
    app.use(router.routes());
    app.use(koaStatic(configTool.wwwPath));


    app.use(appFileRoutes.routes());
    app.use(sysFileRoutes.routes());
    app.use(microService.routes());
}

module.exports = loadMiddleWare;
