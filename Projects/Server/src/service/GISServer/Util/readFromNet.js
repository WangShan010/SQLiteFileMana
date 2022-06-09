const axios = require('axios');

async function readFromNet({url, headers, err, buffer, dataSource}) {
    if (!buffer) {
        await axios.get(url, {
            headers: headers || {},
            responseType: 'arraybuffer'
        }).then(res => {
            dataSource = 'Net';
            buffer = res.data;
            err = null;
        }).catch(reqErr => {
            err = reqErr;
        });
    }
    return [err, buffer, dataSource];
}


module.exports = readFromNet;
