"use strict";
const path = require('path');
const configTool = require('../configTool.js');
const log4js = require('koa-log4');
const log4jsConf = {
    appenders: {
        out: {
            type: 'console'
        },
        access: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            encoding: 'utf-8',
            filename: path.join(configTool.appBasePath, './logs/http/access')
        },
        application: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            encoding: 'utf-8',
            filename: path.join(configTool.appBasePath, './logs/http/application')
        }
    },
    categories: {
        default: { appenders: ['out'], level: 'info' },
        access: { appenders: ['access'], level: 'info' },
        application: { appenders: ['application'], level: 'WARN' }
    }
};
log4js.configure(log4jsConf);
exports.accessLogger = () => log4js.koaLogger(log4js.getLogger('access'));
exports.systemLogger = log4js.getLogger('application');
//# sourceMappingURL=log4.js.map