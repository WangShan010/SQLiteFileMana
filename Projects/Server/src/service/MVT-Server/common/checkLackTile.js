const path = require('path');
const FSTool = require('../../../lib/FSTool/index.js');

class CheckLackTile {
    constructor(TileUtil) {
        this.TileUtil = TileUtil;
    }

    async scanTileList(tilePath) {
        const filePathList = await FSTool.getFileList(tilePath);
        let set = new Set();
        while (filePathList.length) {
            let fileStr = filePathList.pop().replace(path.join(tilePath, '') + '\\', '');
            fileStr = fileStr.replace(path.extname(fileStr), '');
            let [zoom, x, y] = fileStr.split('\\');
            set.add({x: Number(x), y: Number(y), zoom: Number(zoom)});
        }
        return [...set];
    }

    async findLackTile(allTileList, scanTileList, minZoom = 0, maxZoom = 4) {
        let allTileSet = new Set();

        while (allTileList.length) {
            let tile=allTileList.pop();
            if (tile.zoom >= minZoom && tile.zoom <= maxZoom) {
                allTileSet.add(JSON.stringify(tile));
            }
        }

        while (scanTileList.length) {
            let tile = scanTileList.pop();
            if (tile.zoom >= minZoom && tile.zoom <= maxZoom) {
                allTileSet.delete(JSON.stringify(tile));
            }
        }

        return [...allTileSet].map(item => JSON.parse(item));
    }
}


module.exports = CheckLackTile;
