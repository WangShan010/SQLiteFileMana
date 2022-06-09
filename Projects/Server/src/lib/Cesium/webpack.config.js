const path = require('path');

// 打包全部的
let all = {
    mode: 'production',
    entry: './Cesium.js',
    output: {
        path: path.resolve(__dirname, './Build'),
        filename: `Cesium.min.js`,
        library: {
            type: 'umd'
        },
        libraryExport: 'default',
        globalObject: 'this'
    },
    watch: true   // 监听修改自动打包
};

module.exports = all;


