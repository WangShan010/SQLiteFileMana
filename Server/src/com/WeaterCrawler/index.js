// 和风天气，实时天气接口。免费版不支持查询历史天气
const CronJob = require('cron').CronJob;
const axios = require('axios');
const Moment = require('moment');
const fs = require('fs');
const fsPromise = require('fs-promise');
const path = require('path');
const configTool = require('../../lib/configTool.js');
const cityList = require('./China-City-List-latest.json');


// 秒：0-59
// 分钟：0-59
// 小时：0-23
// 天：1-31
// 月份：0-11（1月至12月）
// 星期几：0-6（周日至周六）
// 每天 12:00:00 执行
new CronJob('0 0 12 * * *', async function () {
    let dateStr = Moment().format('YYYY-MM-DD');
    for (let i = 0; i < cityList.length; i++) {
        let weatherData = await getWeatherData(String(cityList[i].Location_ID));
        await fsPromise.ensureDir(path.join(configTool.appBasePath, `logs/crawler/${dateStr}`));
        fs.writeFileSync(path.join(configTool.appBasePath, `logs/crawler/${dateStr}/${cityList[i].Location_Name_ZH}.json`), JSON.stringify(weatherData));
    }
    console.log('数据爬取完成', dateStr);
}, null, true, 'Europe/London');


// 获取天气信息
async function getWeatherData(location) {
    let url = 'https://devapi.qweather.com/v7/air/now';

    let res = await axios({
        method: 'get',
        url: url,
        params: {
            location: location,
            key: 'e4f2b99de28e48bfa0f5f1a45afedebf'
        }
    });
    return res.data;
}


console.log('天气爬虫初始化成功，每天中午 12 点爬取实时天气');
