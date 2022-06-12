const path = require('path');

/**
 * 分解路径
 * @param filePath ：'\\Administrator\\Desktop\\test\\test.txt'
 * @returns
 * [
 *   '\\Administrator\\',
 *   '\\Administrator\\Desktop\\',
 *   '\\Administrator\\Desktop\\test\\'
 * ]
 */
function pathSplit(filePath) {
    let pathList = [];
    let pathSplit = filePath.replaceAll('/', '\\').split('');
    for (let i = 0; i < pathSplit.length; i++) {
        if (pathSplit[i] === '\\' || i === pathSplit.length) {
            pathList.push(pathSplit.slice(0, i + 1).join(''));
        }
    }


    return pathList;
}

module.exports = pathSplit;
