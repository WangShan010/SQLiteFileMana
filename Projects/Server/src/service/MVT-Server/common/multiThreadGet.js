const axios = require('axios');
const awaitWrap = require('../../../lib/awaitWrap.js');


async function multiThreadGet(urlList, count = 10) {

    let responseMap = new Map();
    let sum = urlList.length;
    while (urlList.length > 0) {
        responseMap.set(urlList.pop(), 'await');
    }

    // 尝试发起 三 轮请求
    for (let tryIndex = 0; tryIndex < 3; tryIndex++) {
        let map = new Map();
        let getIndex = 0;

        for (const [url] of responseMap) {
            if (responseMap.get(url)) {
                map.set(url, awaitWrap(axios.get(url).then(() => {
                    responseMap.delete(url);
                    map.delete(url);
                    if (getIndex % 100 === 0) {
                        console.log('已完成', getIndex, '/', sum, getIndex / sum * 100 + '%');
                    }
                }).catch((e) => {
                    responseMap.set(url, 'Err');
                    map.delete(url);
                    console.log('请求失败', url);
                })));

                if (map.size >= count) {
                    await Promise.race(Array.from(map.values()));
                }
                getIndex++;
            }
        }
        await Promise.all(Array.from(map.values()));
    }
}


module.exports = multiThreadGet;
