const API = {};

API.getDBList = async function () {
  return new Promise(function (resolve, reject) {
    axios({
      method: 'get',
      url: 'http://localhost:3000/appFile/getDBList'
    }).then(function (date) {
      let resData = date.data;
      resolve(resData);
    }).catch(function (e) {
      resolve([]);
    });
  });
};

API.getDBPathTree = async function (DBName) {
  if (!DBName) return;

  return new Promise(function (resolve, reject) {
    axios({
      method: 'get',
      url: 'http://localhost:3000/appFile/getDBPathTree',
      params: {
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

// 根据路径获取文件列表
API.getFileListByPath = async function (DBName, path = '\\') {
  if (!DBName) return;

  return new Promise(function (resolve, reject) {
    axios({
      method: 'get',
      url: 'http://localhost:3000/appFile/getFileListByPath',
      params: {
        DBName, path
      }
    }).then(function (date) {
      let resData = date.data;
      resolve(resData);
    }).catch(function (e) {
      resolve(null);
    });
  });

};

API.choosePath = async function () {
  return new Promise(function (resolve, reject) {
    axios({
      method: 'get',
      url: 'http://localhost:3000/sysFile/choosePath'
    }).then(function (date) {
      let resData = date.data;
      resolve(resData.path);
    }).catch(function (e) {
      resolve(null);
    });
  });
};

// 根据路径获取文件的二进制数组
API.getFileByFullPath = function (DBName, path) {
  if (!DBName || !path) return;

  return new Promise(function (resolve, reject) {
    axios({
      method: 'get',
      url: 'http://localhost:3000/appFile/getFileByFullPath',
      responseType: 'arraybuffer',
      params: {
        DBName, path
      }
    }).then(function (date) {
      let resData = date.data;
      resolve(resData);
    }).catch(function (e) {
      resolve(null);
    });
  });

};


API.createDB = async function (targetDirectory, DBName) {
  if (!targetDirectory || !DBName) return;

  return new Promise(function (resolve, reject) {
    axios({
      method: 'get',
      url: 'http://localhost:3000/appFile/createDB',
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
API.exportDB = async function (targetDirectory, DBName) {
  if (!targetDirectory || !DBName) return;

  return new Promise(function (resolve, reject) {
    axios({
      method: 'get',
      url: 'http://localhost:3000/appFile/exportDB',
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

export default API;
