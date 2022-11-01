const axios = require('axios');

async function readFromNet({url, headers, err, buffer, dataSource}: any) {
    if (!buffer) {
        await axios.get(url, {
            headers: headers || {},
            responseType: 'arraybuffer'
        }).then((res: any) => {
            dataSource = 'Net';
            buffer = res.data;
            err = null;
        }).catch((reqErr: any) => {
            err = reqErr;
        });
    }
    return [err, buffer, dataSource];
}


export = readFromNet;
