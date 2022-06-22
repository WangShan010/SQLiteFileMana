const path = require('path');
const TileSet = require('./TileSet.js');
const FSTool = require('../../../lib/FSTool/index.js');


class CheckLackTile {
    constructor(tilePath) {
        // 确保瓦片文件夹路径是以 \\ 结尾
        if (tilePath.endsWith('/') || tilePath.endsWith('\\')) {
            this.tilePath = path.join(tilePath, '');
        } else {
            this.tilePath = path.join(tilePath + '\\', '');
        }

        this.hasTileList = [];
    }

    /**
     * 扫描瓦片文件夹，获取瓦片列表
     * @param scanZoom          扫描瓦片的缩放级别，默认为 -1 扫描所有层级
     * @returns {Promise<[]>}
     */
    async scanTileList(scanZoom = -1) {
        let scanPath = scanZoom === -1 ? this.tilePath: this.tilePath + scanZoom + '\\';
        const filePathList = await FSTool.getFileList(scanPath);


        let tileSet = new TileSet();
        while (filePathList.length) {
            let fileItem = filePathList.pop();
            let fileStr = fileItem.replace(path.join(this.tilePath, ''), '');
            fileStr = fileStr.replace(path.extname(fileStr), '');
            let [zoom, x, y] = fileStr.split('\\');
            if (!isNaN(zoom) && !isNaN(x) && !isNaN(y)) {
                if (scanZoom === -1 || Number(zoom) === scanZoom) {
                    tileSet.add(Number(x), Number(y), Number(zoom));
                }
            }
        }

        this.hasTileList = tileSet.getAll();
        return this.hasTileList;
    }

    async findLackTile(allTileList, scanZoom = -1) {
        let hasTileList = await this.scanTileList(scanZoom);
        let lackTileSet = new TileSet();


        for (let i = 0; i < allTileList.length; i++) {
            let tile = allTileList[i];
            if (tile.zoom === scanZoom || scanZoom === -1) {
                lackTileSet.add(tile.x, tile.y, tile.zoom);
            }
        }

        for (let i = 0; i < hasTileList.length; i++) {
            let tile = hasTileList[i];
            if (tile.zoom === scanZoom || scanZoom === -1) {
                lackTileSet.delete(tile.x, tile.y, tile.zoom);
            }
        }

        return lackTileSet.getAll();
    }
}


module.exports = CheckLackTile;
