// 和风天气，实时天气接口。免费版不支持查询历史天气
const CronJob = require('cron').CronJob;
const axios = require('axios');
const Moment = require('moment');
const fs = require('fs');
const fsPromise = require('fs-promise');
const path = require('path');
const configTool = require('../configTool.js');
const cityList = require('./China-City-List-latest.json');
const awaitWrap = require('../../lib/awaitWrap.js');


// 秒：0-59
// 分钟：0-59
// 小时：0-23
// 天：1-31
// 月份：0-11（1月至12月）
// 星期几：0-6（周日至周六）
// 每天 12:00:00 执行
// new CronJob('0 30 * * * *', async function () {
     weatherCrawler();
// }, null, true, 'Europe/London');


// 执行爬取天气数据
async function weatherCrawler() {
    let dateStr = Moment().format('YYYY-MM-DD');
    for (let i = 0; i < cityList.length; i++) {
        let Location_Name_ZH = cityList[i].Location_Name_ZH;
        let filePath = path.join(configTool.appBasePath, `logs/weather/${dateStr}/${Location_Name_ZH}.json`);
        await fsPromise.ensureDir(path.join(configTool.appBasePath, `logs/weather/${dateStr}`));
        console.log('爬取天气数据：', Location_Name_ZH, i / cityList.length * 100, '%');
        try {
            fs.readFileSync(filePath);
        } catch (e) {
            let [err, weatherData] = await awaitWrap(getWeatherData(String(cityList[i].Location_ID)));
            weatherData && fs.writeFileSync(filePath, JSON.stringify(weatherData));
        }
    }
    console.log('天气数据爬取完成', dateStr);
}

// 获取天气信息
async function getWeatherData(location) {
    let url = 'https://devapi.qweather.com/v7/weather/now';

    let [err, data] = await awaitWrap(axios({method: 'get', url: url, params: {location: location, key: 'e4f2b99de28e48bfa0f5f1a45afedebf'}}));

    if (err) {
        return null;
    } else {
        return data.data;
    }
}


console.log('天气爬虫初始化成功，每天中午 12 点爬取实时天气');
