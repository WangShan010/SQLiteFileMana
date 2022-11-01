import appFileRoutes from '../../routes/AppFileRoutes.js';
import cacheRoutes from '../../routes/CacheRoutes.js';
import DBRoutes from '../../routes/DBRoutes.js';


function serverProxy(app: any) {
    app.use(appFileRoutes.routes());
    app.use(cacheRoutes.routes());
    app.use(DBRoutes.routes());
}


export = serverProxy;
