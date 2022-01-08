const zlibPromise = require('../../../src/mainRenderer/components/Lib/FSTool/gzip.js');
const treeJson = require('./0.json');
const fs = require('fs');


// 压缩字符串文件，21%
async function main01() {
    const treeJsonStr = JSON.stringify(treeJson);
    const zlibBuffer = await zlibPromise.zip(treeJsonStr);

    const a = treeJsonStr.length / 1024 / 1024;
    const b = zlibBuffer.length / 1024 / 1024;
    console.log('压缩效率：', Math.floor(b / a * 100), '%，原始数据：', a, 'MB');
}

// 压缩图片，几乎无法再进行压缩
async function main02() {
    const imgBuffer = fs.readFileSync(__dirname + '/0.png');
    const zlibBuffer = await zlibPromise.zip(imgBuffer);

    const a = imgBuffer.length / 1024 / 1024;
    const b = zlibBuffer.length / 1024 / 1024;

    console.log('压缩效率：', Math.floor(b / a * 100), '%，原始数据：', a, 'MB');
}

// 压缩地形文件，28%
async function main03() {
    const imgBuffer = fs.readFileSync(__dirname + '/0.terrain');
    const zlibBuffer = await zlibPromise.zip(imgBuffer);

    const a = imgBuffer.length / 1024 / 1024;
    const b = zlibBuffer.length / 1024 / 1024;

    // 几乎无法再进行压缩
    console.log('压缩效率：', Math.floor(b / a * 100), '%，原始数据：', a, 'MB');
}

main03();
