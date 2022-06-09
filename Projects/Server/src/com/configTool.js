const path = require('path');
const fsPromise = require('fs-promise');
const createAesAPair = require('../lib/createAesAPair.js');
let configInit = false;
const configTool = {
    appBasePath: '',
    wwwPath: '',
    config: {},
    init: async function () {
        if (configInit === false) {
            configInit = true;

            // 是否处于开发环境
            let isDev = process.execPath.indexOf('app.exe') === -1;

            if (isDev) {
                this.appBasePath = path.join(__dirname, '../../');
            } else {
                this.appBasePath = path.dirname(process.execPath);
            }

            await fsPromise.ensureDir(path.join(this.appBasePath, '/conf'));
            await fsPromise.ensureDir(path.join(this.appBasePath, '/temp/fileOut'));
            await fsPromise.ensureDir(path.join(this.appBasePath, '/temp/fileDB'));
            await fsPromise.ensureDir(path.join(this.appBasePath, '/temp/logs/http'));
            await fsPromise.ensureDir(path.join(this.appBasePath, '/www'));

            let configFile = path.join(this.appBasePath, '/conf/config.json');

            // 判断是读取配置文件
            await fsPromise.readJson(configFile).then(d => {
                this.config = d;

                // 判断配置文件开启了安全模块，并且还未初始化安全模块
                if (this.config.safeModule && this.config.safeModule.publicDer === '' && this.config.safeModule.privateDer === '') {
                    let rsa = createAesAPair();
                    this.config.safeModule.privateDer = rsa.privateDer;
                    this.config.safeModule.publicDer = rsa.publicDer;
                    fsPromise.writeJSON(configFile, this.config);
                }

            }).catch(e => {
                // 新生成一份配置文件
                this.config = {
                    'clientServerPort': 3000,
                    'manageServerPort': 3001,
                    'wwwPath': 'www',
                    'prefixHTTPList': [],
                    'CacheSaveFile': false,
                    'CacheSaveDB': true,
                    'safeModule': {
                        'state': false,
                        'publicDer': '',
                        'privateDer': ''
                    }
                };
                fsPromise.writeJSON(configFile, this.config);
            });

            this.wwwPath = path.join(this.appBasePath, this.config.wwwPath);
        }
    }
};


module.exports = configTool;
