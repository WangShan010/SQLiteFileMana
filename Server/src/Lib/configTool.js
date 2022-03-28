const path = require('path');
const fsPromise = require('fs-promise');

const configTool = {
    appBasePath: '',
    config: null,
    init: async function () {

        try {
            let basePath = '../../config/config.json';
            this.config = await fsPromise.readJSON(path.join(__dirname, basePath));
            this.appBasePath = path.join(__dirname, '../../');
        } catch (e){
            let basePath = './config/config.json';
            this.config = await fsPromise.readJSON(path.join(path.dirname(process.execPath), basePath));
            this.appBasePath = path.dirname(process.execPath);
        }
    }
};


module.exports = configTool;
