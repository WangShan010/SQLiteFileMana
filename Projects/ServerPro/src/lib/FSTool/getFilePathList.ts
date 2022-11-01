const {fdir} = require('fdir');


/***
 * 获取目录下全部子文件列表，fdir 速度无与伦比。它可以在不到1秒的时间内轻松检索包含一百万个文件的目录！
 * @param parentPath    子文件夹的绝对路径
 */
async function getFilePathList(parentPath: string) {
    const api = new fdir().withFullPaths().crawl(parentPath);
    return await api.withPromise();
}


export = getFilePathList;
