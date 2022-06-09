const ClientAPI = {};
import arraySortByKey from './arraySortByKey.js';




ClientAPI.getFileByMd5 = async function (DBName, md5) {
    return new Promise(function (resolve, reject) {
        axios({
            method: 'get', url: `http://localhost:${window.clientServerPort}/appFile/getFileByMd5`, responseType: 'arraybuffer', params: {
                DBName, md5
            }
        }).then(function (date) {
            let resData = date.data;
            resolve(resData);
        }).catch(function (e) {
            resolve(null);
        });
    });
};

ClientAPI.getFileByFullPath = function (DBName, fullPath) {
    if (!DBName || !fullPath) return;

    return new Promise(function (resolve, reject) {
        axios({
            method: 'get', url: `http://localhost:${window.clientServerPort}/appFile/getFileByFullPath`, params: {
                DBName, fullPath
            }
        }).then(function (date) {
            let resData = date.data;
            resolve(resData);
        }).catch(function (e) {
            resolve(null);
        });
    });

};


export default ClientAPI;
