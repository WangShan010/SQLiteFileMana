const errHandler = require('./lib/errHandler');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const ManaRoutes = require('../routes/ManaRoutes.js');


function manaMiddleWare(app: any) {
    app.use(errHandler());
    app.use(cors());
    app.use(bodyParser());

    app.use(ManaRoutes.routes());
}


export = manaMiddleWare;
