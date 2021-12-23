const zlibPromise = require('../../src/mainRenderer/components/Utils/gzip.js');
const treeJson = require('./tree.json');



async function main() {
    let treeJsonStr = JSON.stringify(treeJson);
    console.time('main');
    const strZlib = await zlibPromise.zip(treeJsonStr);
    console.log(treeJsonStr.length / 1024 / 1024);
    console.log(strZlib.length / 1024 / 1024);
    console.timeEnd('main');
}


main();
