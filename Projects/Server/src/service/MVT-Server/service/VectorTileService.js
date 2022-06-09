const {TileUtil} = require('../common/TileUtil3857.js');
const {VectorTileDao} = require('../dao/VectorTileDao.js');

class VectorTileService {
    constructor(dbConnect) {
        this.vectorTileDao = new VectorTileDao(dbConnect);
    }

    // 多边形要素
    getDKTile(x, y, z, tableName, layerPickName) {
        const tileBox = TileUtil.tile2boundingBox(x, y, z);
        tileBox.tableName = tableName;
        tileBox.layerPickName = layerPickName;

        return this.vectorTileDao.dkTile(tileBox);
    }

    // 边界要素
    getBoundTile(x, y, z, tableName, layerPickName) {
        const tileBox = TileUtil.tile2boundingBox(x, y, z);
        tileBox.tableName = tableName;
        tileBox.layerPickName = layerPickName;

        return this.vectorTileDao.BoundTile(tileBox);
    }

    // 线要素
    getLineTile(x, y, z, tableName, layerPickName) {
        const tileBox = TileUtil.tile2boundingBox(x, y, z);
        tileBox.tableName = tableName;
        tileBox.layerPickName = layerPickName;

        return this.vectorTileDao.lineTile(tileBox);
    }

    // 文字要素
    getTextTile(x, y, z, tableName, layerPickName) {
        const tileBox = TileUtil.tile2boundingBox(x, y, z);
        tileBox.tableName = tableName;
        tileBox.layerPickName = layerPickName;

        return this.vectorTileDao.TextTile(tileBox);
    }
}

exports.VectorTileService = VectorTileService;
