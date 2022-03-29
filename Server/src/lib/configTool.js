const path = require('path');
const FSTool = require('../lib/FSTool/index.js');

const configTool = {
    appBasePath: '',
    wwwPath: '',
    config: {
        'port': null,
        'wwwPath': null
    }
};

(function () {
    try {
        let basePath = '../../conf/config.json';
        configTool.config = JSON.parse(FSTool.readFileSync(path.join(__dirname, basePath)).toString());
        configTool.appBasePath = path.join(__dirname, '../../');
    } catch (e) {
        let basePath = './conf/config.json';
        configTool.config = JSON.parse(FSTool.readFileSync(path.join(path.dirname(process.execPath), basePath)).toString());
        configTool.appBasePath = path.dirname(process.execPath);
    }

    configTool.wwwPath = path.join(configTool.appBasePath, configTool.config.wwwPath);
})();

module.exports = configTool;
