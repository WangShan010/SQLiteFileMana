const os = require('os');


function getServerInfo() {
    return {
        '系统架构': os.arch(),
        '机器名称': os.hostname(),
        '内存容量': Math.ceil(os.totalmem() / 1024 / 1024 / 1024) + 'GB',
        '操作系统': os.type(),
        '处理器': os.cpus()[0].model + ' X ' + os.cpus().length
    };
}


module.exports = getServerInfo;
