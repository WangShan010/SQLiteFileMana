const router = require('koa-router');
import url from 'url';
import {openDB} from '../com/DBTool/DBConnectTool';
import CryptoUtil from '../lib/CryptoUtil.js';
import zlibPromise from '../lib/FSTool/zlibPromise.js';

const EncryptRoutes = new router({prefix: '/Encrypt'});

EncryptRoutes
    .get('/(.*)', async (ctx: any) => {
        let reqUrl = ctx.request.url.replace('/Encrypt/', '');
        let urlObj = url.parse(reqUrl, true) as any;
        reqUrl = decodeURI(urlObj.pathname);

        let pathItem = reqUrl.split('/');

        if (pathItem?.length) {
            let DBName = pathItem.shift();
            let fullPath = '/' + pathItem.join('/');

            let file;
            let dbTool = await openDB(DBName);

            if (dbTool) {
                file = await dbTool.getFileByFullPath(fullPath, false);
            } else {
                ctx.status = 422;
                ctx.set('Content-Type', 'application/json;charset=utf-8');
                ctx.body = JSON.stringify({message: `数据库不存在：【${DBName}】，正在新建数据库中，请稍后...`});
                return;
            }

            if (!file || !file.file_data) {
                ctx.status = 422;
                ctx.set('Content-Type', 'application/json;charset=utf-8');
                ctx.body = JSON.stringify({message: `数据库：【${DBName}】，不存在该文件资源，路径：【${fullPath}】`});
            } else {
                file.file_data = file.file_zip === 'gzip' ? await zlibPromise.unzip(file.file_data) : file.file_data;
                let hexStr = file.file_data.toString('hex');

                ctx.body = {
                    code: 200,
                    name: file.file_name,
                    md5: file.file_md5,
                    message: '数据包已加密，加密等级：最高',
                    version: 'ServerPro v2.2',
                    generateTool: 'https://gitee.com/WangShan010/SQLiteFileMana',
                    content: CryptoUtil.Encrypt(hexStr, '1234567890')
                };
            }
        }
    });


export = EncryptRoutes;
