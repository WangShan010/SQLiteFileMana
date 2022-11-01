const path = require('path');
const configTool = require('../configTool.js');
const log4js = require('koa-log4');

const log4jsConf = {
    appenders: {
        out: {
            type: 'console'
        },
        // 访问日志
        access: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log', //通过日期来生成文件
            alwaysIncludePattern: true, //文件名始终以日期区分
            encoding: 'utf-8',
            filename: path.join(configTool.appBasePath, './logs/http/access') //生成文件路径和文件名
        },
        // 系统日志
        application: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log', //通过日期来生成文件
            alwaysIncludePattern: true, //文件名始终以日期区分
            encoding: 'utf-8',
            filename: path.join(configTool.appBasePath, './logs/http/application') //生成文件路径和文件名
        }
    },
    categories: {
        default: {appenders: ['out'], level: 'info'},
        access: {appenders: ['access'], level: 'info'},
        application: {appenders: ['application'], level: 'WARN'}
    }
};

log4js.configure(log4jsConf);

exports.accessLogger = () => log4js.koaLogger(log4js.getLogger('access')); //记录所有访问级别的日志
exports.systemLogger = log4js.getLogger('application');  //记录所有应用级别的日志
