// 计算字符串的 MD5
async function stringMd5(str: string) {
    return require('crypto').createHash('md5').update(Buffer.from(str)).digest('hex');
}


export = stringMd5;
