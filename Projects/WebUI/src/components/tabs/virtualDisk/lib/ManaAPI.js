import arraySortByKey from './arraySortByKey';

const ManaAPI = {};

ManaAPI.getServerInfo = async function () {
    return new Promise(function (resolve, reject) {
        axios({
            method: 'get',
            url: `http://localhost:${window.manageServerPort}/manage/getServerInfo`
        }).then(function (date) {
            let resData = date.data;
            resolve(resData);
        }).catch(function (e) {
            resolve(null);
        });
    });
};

ManaAPI.choosePath = async function () {
    return new Promise(function (resolve, reject) {
        axios({
            method: 'get', url: `http://localhost:${window.winServerPort}/sysFile/choosePath`
        }).then(async function (date) {
            let {path} = date.data;
            let res = await axios({method: 'get', url: `http://localhost:${window.manageServerPort}/manage/scanPath`, params: {path}});
            let {fileCount} = res.data;
            resolve({path, fileCount});
        }).catch(function (e) {
            resolve(null);
        });
    });
};

ManaAPI.getFileListByPath = async function (DBName, path = '\\') {
    if (!DBName) return;

    return new Promise(function (resolve, reject) {
        axios({
            method: 'get', url: `http://localhost:${window.manageServerPort}/manage/getFileListByPath`, params: {
                DBName, path
            }
        }).then(function (date) {
            let pathList = date.data || [];
            let dirList = [];
            let fileList = [];
            pathList.forEach(item => {
                if (item.ext === 'directory') {
                    dirList.push(item);
                } else {
                    fileList.push(item);
                }
            });

            pathList = [...arraySortByKey(dirList, 'file_name'), ...arraySortByKey(fileList, 'file_name')];
            resolve(pathList);
        }).catch(function (e) {
            resolve([]);
        });
    });

};

ManaAPI.getDBList = async function () {
    return new Promise(function (resolve, reject) {
        axios({
            method: 'get', url: `http://localhost:${window.manageServerPort}/manage/getDBList`
        }).then(function (date) {
            let resData = date.data;
            resolve(resData);
        }).catch(function (e) {
            resolve([]);
        });
    });
};

ManaAPI.getDBPathTree = async function (DBName) {
    if (!DBName) return;

    return new Promise(function (resolve, reject) {
        axios({
            method: 'get', url: `http://localhost:${window.manageServerPort}/manage/getDBPathTree`, params: {
                DBName
            }
        }).then(function (date) {
            let resData = date.data;
            resolve(resData);
        }).catch(function (e) {
            resolve(null);
        });
    });

};

ManaAPI.getFileBySearch = async function (DBName, text) {
    if (!DBName || !text) return;

    return new Promise(function (resolve, reject) {
        axios({
            method: 'get', url: `http://localhost:${window.manageServerPort}/manage/getFileBySearch`, params: {
                DBName, text
            }
        }).then(function (date) {
            let resData = date.data;
            resolve(resData);
        }).catch(function (e) {
            resolve(null);
        });
    });

};

ManaAPI.getDirInfo = async function (DBName, dirPath) {
    if (!DBName || !dirPath) return;
    return new Promise(function (resolve, reject) {
        axios({
            method: 'get', url: `http://localhost:${window.manageServerPort}/manage/getDirInfo`, params: {
                DBName, dirPath
            }
        }).then(function (date) {
            let resData = date.data;
            resolve(resData);
        }).catch(function (e) {
            resolve(null);
        });
    });
};

ManaAPI.openCatalogue = async function (path) {
    return new Promise(function (resolve, reject) {
        axios({
            method: 'get', url: `http://localhost:${window.winServerPort}/sysFile/openCatalogue`, params: {
                path
            }
        }).then(function (date) {
            resolve(date);
        }).catch(function (e) {
            resolve(null);
        });
    });
};

ManaAPI.createDB = async function (targetDirectory, DBName, mataData) {
    if (!targetDirectory || !DBName) return;

    return new Promise(function (resolve, reject) {
        axios({
            method: 'get',
            url: `http://localhost:${window.manageServerPort}/manage/createDB`,
            params: {
                targetDirectory,
                DBName,
                mataData: JSON.stringify(mataData)
            }
        }).then(function (date) {
            let resData = date.data;
            resolve(resData);
        });
    });
};

ManaAPI.appendFile = async function (DBName, targetDirectory, currentDirectory) {
    if (!DBName || !targetDirectory || !currentDirectory) return;

    return new Promise(function (resolve, reject) {
        axios({
            method: 'get',
            url: `http://localhost:${window.manageServerPort}/manage/appendFile`,
            params: {
                DBName,
                targetDirectory,
                currentDirectory
            }
        }).then(function (date) {
            let resData = date.data;
            resolve(resData);
        });
    });

};

ManaAPI.setMataData = async function (DBName, mataData) {
    if (!DBName || !mataData) return;

    return new Promise(function (resolve, reject) {
        axios({
            method: 'get',
            url: `http://localhost:${window.manageServerPort}/manage/setMataData`,
            params: {
                DBName,
                mataData: JSON.stringify(mataData)
            }
        }).then(function (date) {
            let {msg} = date.data;
            resolve(msg);
        });
    });
};

ManaAPI.deleteByFullPath = async function (DBName, fullPath) {
    if (!DBName || !fullPath) return;

    return new Promise(function (resolve, reject) {
        axios({
            method: 'get',
            url: `http://localhost:${window.manageServerPort}/manage/deleteByFullPath`,
            params: {
                DBName,
                fullPath
            }
        }).then(function (date) {
            let resData = date.data;
            resolve(resData);
        });
    });

};

ManaAPI.deleteByDir = async function (DBName, directory) {
    if (!DBName || !directory) return;

    return new Promise(function (resolve, reject) {
        axios({
            method: 'get',
            url: `http://localhost:${window.manageServerPort}/manage/deleteByDir`,
            params: {
                DBName,
                directory
            }
        }).then(function (date) {
            let resData = date.data;
            resolve(resData);
        });
    });
};

ManaAPI.exportDB = async function (targetDirectory, DBName) {
    if (!targetDirectory || !DBName) return;

    return new Promise(function (resolve, reject) {
        axios({
            method: 'get',
            url: `http://localhost:${window.manageServerPort}/manage/exportDB`,
            params: {
                targetDirectory,
                DBName
            }
        }).then(function (date) {
            let resData = date.data;
            resolve(resData);
        }).catch(function (e) {
            resolve(null);
        });
    });
};

ManaAPI.deleteDB = async function (DBName) {
    if (!DBName) return;
    return new Promise(function (resolve, reject) {
        axios({
            method: 'get',
            url: `http://localhost:${window.manageServerPort}/manage/deleteDB`,
            params: {
                DBName
            }
        }).then(function (date) {
            let {result} = date.data;
            resolve(result);
        }).catch(function (e) {
            resolve(null);
        });
    });
};

export default ManaAPI;
