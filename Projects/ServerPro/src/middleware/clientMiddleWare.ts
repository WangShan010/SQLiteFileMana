const cors = require('koa2-cors');
const compress = require('koa-compress');
const bodyParser = require('koa-bodyparser');
const resourcesProxy = require('./proxy/resourcesProxy.js');
const portProxy = require('./proxy/portProxy.js');
const errHandler = require('./lib/errHandler.js');
const appFileRoutes = require('../routes/AppFileRoutes.js');
const cacheRoutes = require('../routes/CacheRoutes.js');
const DBRoutes = require('../routes/DBRoutes.js');
const EncryptRoutes = require('../routes/EncryptRoutes.js');
const configTool = require('../com/configTool.js');

function clientMiddleWare(app: any) {
    app.use(errHandler());

    // 允许跨域请求
    configTool.config.clientCORS && app.use(cors());

    app.use(compress({br: false}));

    resourcesProxy(app);
    portProxy(app);

    // 最后再进行 post 请求格式化
    app.use(bodyParser());

    // 数据转发缓存服务
    configTool.config.CacheSave.state && app.use(cacheRoutes.routes());


    app.use(appFileRoutes.routes());
    app.use(DBRoutes.routes());
    app.use(EncryptRoutes.routes());
}

export = clientMiddleWare;
