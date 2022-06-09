const { VectorTileService } = require('../service/VectorTileService.js');
const axios = require('axios');

class VectorTileController {
  constructor (dbConnect) {
    this.vectorTileService = new VectorTileService(dbConnect);
  }

  getMVT ({ layerPickName, type, table, z, x, y }) {
    let p = null;

    layerPickName = layerPickName || table + '-' + type;

    if (type === 'polygon') {
      p = this.vectorTileService.getDKTile(x, y, z, table, layerPickName);
    } else if (type === 'bound') {
      p = this.vectorTileService.getBoundTile(x, y, z, table, layerPickName);
    } else if (type === 'line') {
      p = this.vectorTileService.getLineTile(x, y, z, table, layerPickName);
    } else if (type === 'text') {
      p = this.vectorTileService.getTextTile(x, y, z, table, layerPickName);
    } else {
      return '错误的请求格式：' + type + ',应该为 ‘polygon’ 、 ‘bound’ 或 ‘line’';
    }

    return p;
  }

  // 从网络上获取 .PBF 格式的矢量切片
 static getWebMVT ({ baseURL, layerPickName, type, table, z, x, y }) {
    return new Promise(function (resolve, reject) {
      axios.get(`${baseURL} + '/vector/${type}/${table}/{${z}/{${x}/{${y}?layerPickName=${layerPickName}`,
        { responseType: 'arraybuffer' }).then(function (res) {
        resolve(res.data);
      });
    });
  }
}

exports.VectorTileController = VectorTileController;
