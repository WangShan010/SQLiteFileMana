(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    const path = require('path');
    const fsPromise = require('fs-promise');
    const colors = require('colors-console');
    const sleep = require('../lib/sleep.js');
    let configInit = false;
    const defaultConfig = {
        'version': 'v2.2',
        'clientServerPort': 3000,
        'manageServerPort': 3001,
        'clientCORS': true,
        'wwwPath': 'www',
        'prefixHTTPList': [],
        'CacheSave': {
            'state': true,
            'CacheSaveFile': true,
            'CacheSaveDB': false
        },
        'WinUIAuth': '83d3b6362628b28e6ebf2c1a6ab7b5904eba5ccabfc72a8cfb947f737b2fb2d32eece8186c1a439c79c2886187368f33f4a9ff5e5c49ada9dc38d41c8a063c9fed5f2b7072665265a357e800dd5ac990d06f177628e2a7a5883a7db1a99b999b085f63d3ba23b8c3757d4527def6451b28abe299e93d96da713233a63aa3cf65be4c54eb2a1643337b1625a7b83a0069c5ba8be14a5cf3ce6d9ed3d738fcb5b09be5960cb065a9908baf4c5ec3d02595c8114843e441ba540bcbbea65e516dd4f0b5df34e1d948608c8e73f9a4b4969ecc68fafcbf49120775a5d5571677ca2b2ef7dd83b9757060cddd0d050d576ddbb6feb5bad39f6ee8ab3cb6c725bc38a2a5aee6114f7c8474dd598d6a8c6321dd84186af8e1b92d45797b86939bbdb8d3ee743f8195ac27cd8468d9bb1ad1efbf521fd8a49792cdd5b357f3891f0261d8d08c2f1304328f0068c7ee541e5ed0dd1736a75500b2b05f7b558f7b5872ade56aeb8e7b9d99c7fba511c936ef1102acc6e04b4e607c77f09148311b06591dd6d2f25811deff334b3b4791cdf81e0654860396f74682a971377ddb912b1fac6163d0dd097f8f7f86836d2237c113b73b14eef72a046bbd2fa3bc640b0b84cfd1dfb08f3edbacec8732e990d6278dc407e1f26bbc2cab7e940791b26192091dfe36e7343c359c0e97f756d08bb03690424f2272eee80294c8f28a3959bc855b5f'
    };
    const configTool = {
        appBasePath: '',
        wwwPath: '',
        config: {},
        async editConfig(key, value) {
            await this.init();
            let result = false;
            if (typeof this.config[key] === typeof value) {
                this.config[key] = value;
                await fsPromise.writeJSON(path.join(this.appBasePath, '/conf/config.json'), this.config);
                result = true;
            }
            return result;
        },
        async init() {
            return new Promise(async (resolve, reject) => {
                if (!configInit) {
                    configInit = true;
                    let isDev = !__dirname.includes('snapshot');
                    if (isDev) {
                        this.appBasePath = path.join(__dirname, '../../');
                    }
                    else {
                        this.appBasePath = path.dirname(process.execPath);
                    }
                    await fsPromise.ensureDir(path.join(this.appBasePath, '/conf'));
                    await fsPromise.ensureDir(path.join(this.appBasePath, '/temp/fileOut'));
                    await fsPromise.ensureDir(path.join(this.appBasePath, '/temp/fileDB'));
                    await fsPromise.ensureDir(path.join(this.appBasePath, '/temp/logs/http'));
                    await fsPromise.ensureDir(path.join(this.appBasePath, '/www'));
                    let configFile = path.join(this.appBasePath, '/conf/config.json');
                    await fsPromise.readJson(configFile).then((d) => {
                        if (d.version === defaultConfig.version) {
                            this.config = d;
                        }
                        else {
                            console.log(colors('red', '----|||配置文件版本过低，重置配置文件|||----'));
                            throw new Error('配置文件版本不匹配');
                        }
                    }).catch(() => {
                        this.config = defaultConfig;
                        fsPromise.writeJSON(configFile, this.config);
                    });
                    if (path.isAbsolute(this.config.wwwPath)) {
                        this.wwwPath = path.join(this.config.wwwPath);
                        console.log(this.wwwPath);
                    }
                    else {
                        this.wwwPath = path.join(this.appBasePath, this.config.wwwPath);
                    }
                }
                while (!configInit) {
                    await sleep(50);
                }
                resolve(true);
            });
        },
        preservableONDB() {
            return this.config.CacheSave.state && this.config.CacheSave.CacheSaveDB;
        },
        preservableONFile() {
            return this.config.CacheSave.state && this.config.CacheSave.CacheSaveFile;
        }
    };
    return configTool;
});
//# sourceMappingURL=configTool.js.map