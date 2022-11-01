const os = require('os');
const {machineId, machineIdSync} = require('node-machine-id');

function getServerInfo() {
    return {
        'arch': os.arch(),
        'PCName': os.hostname(),
        'memorySize': Math.ceil(os.totalmem() / 1024 / 1024 / 1024) + 'GB',
        'operatingSystem': os.type(),
        'CPU': os.cpus()[0].model + ' X ' + os.cpus().length,
        'machineId': machineIdSync({original: true})
    };
}


export = getServerInfo;
