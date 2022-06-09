const appFileRoutes = require('../../routes/AppFileRoutes.js');
const cacheRoutes = require('../../routes/CacheRoutes.js');
const DBRoutes = require('../../routes/DBRoutes.js');
const SafeRoutes = require('../../routes/SafeRoutes.js');


function serverProxy(app) {
    app.use(appFileRoutes.routes());
    app.use(cacheRoutes.routes());
    app.use(DBRoutes.routes());
    app.use(SafeRoutes.routes());
}


module.exports = serverProxy;
