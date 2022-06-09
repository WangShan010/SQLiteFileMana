const cors = require('koa2-cors');
const compress = require('koa-compress');
const bodyParser = require('koa-bodyparser');
const resourcesProxy = require('./proxy/resourcesProxy.js');
const portProxy = require('./proxy/portProxy.js');
const errHandler = require('./lib/errHandler.js');
const appFileRoutes = require('../routes/AppFileRoutes.js');
const cacheRoutes = require('../routes/CacheRoutes.js');
const DBRoutes = require('../routes/DBRoutes.js');
const SafeRoutes = require('../routes/SafeRoutes.js');

function clientMiddleWare(app) {
    app.use(errHandler());
    app.use(cors());
    app.use(compress({br: false}));
    app.use(bodyParser());

    resourcesProxy(app);
    portProxy(app);

    app.use(appFileRoutes.routes());
    app.use(cacheRoutes.routes());
    app.use(DBRoutes.routes());
    app.use(SafeRoutes.routes());
}

module.exports = clientMiddleWare;
