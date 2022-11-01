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
    let configInit = false;
    const defaultConfig = {
        'version': 'v1.9',
        'clientServerPort': 3000,
        'manageServerPort': 3001,
        'wwwPath': 'www',
        'prefixHTTPList': [],
        'CacheSave': {
            'state': true,
            'CacheCORS': true,
            'CacheMapBox': true,
            'CacheOSM': true,
            'CacheCesiumTerrain': true,
            'CacheSaveFile': true,
            'CacheSaveDB': false
        },
        'WinUIAuth': '22e5a6a0c780c0895b498746cb3f6dcca1f296f579b37a181a7d7df64e15fd29c9d6f67096b9b7138fad36ce5157ebc7da5741cb3897329f3e37868b23381fd015967b1d99d2d3198f40af7c67452c53b72fce90e1c2d85ceb7a04f330e774d9438ee3a1ec0f2bc038b9af850465eb6c325b39dfd296a1467d756041a423f8ce17ebc975548f7ae3b0770efa6ca6e743dac3570cc8c0145d8fb1778f80cfac982690c5a26c84d81dfc774bdd8fd31d704a29a74043fd6de78aa73ba7b342e97351c9352552df2f6b7db0cb0e2209078f151c3c27f03b3393207a76ded10192835ffa9a1f66e7cae8a4d345444c9f42b6e2fbf3effb9e392634de447305cb4c566164a888dfc1a32c85ff0c58df43e45384a30bed3604896ed57832b756166767bd72d55973e31ec4d29e469927034ec1752af0e6ad99a2cfb48f656930fe01e85c8316934b5032506e525955088a6578dcb6fa8a6e3cb0190fa8888e0ffb350eb5abc9ef443af4ca0c5c2ab4f070325cc24fec06824955a5dab336a21626198fa34bc34c22a6aba05e7496b4a25961193d3b5bc388ca33a835356500b8d72af199df17c849a6c48c4b2986186c62de4f4c1fe1e60a950ebd13e85b771e84f8bdeb0db6e5ea3eb8c5dced1e914c9de7260ecf8248f280ee4f5f072db8dd1c3f5c0a51f306b98dff1d5dc2164e642b9fa1806745aaee693e1a47cf8fa5e085d0b4'
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
                this.wwwPath = path.join(this.appBasePath, this.config.wwwPath);
            }
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