var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "path", "./TileSet.js", "../FSTool/index.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    const path = require("path");
    const TileSet_js_1 = __importDefault(require("./TileSet.js"));
    const index_js_1 = __importDefault(require("../FSTool/index.js"));
    class CheckLackTile {
        tilePath;
        hasTileList;
        constructor(tilePath) {
            if (tilePath.endsWith('/') || tilePath.endsWith('\\')) {
                this.tilePath = path.join(tilePath, '');
            }
            else {
                this.tilePath = path.join(tilePath + '\\', '');
            }
            this.hasTileList = [];
        }
        async scanTileList(scanZoom = -1) {
            let scanPath = scanZoom === -1 ? this.tilePath : this.tilePath + scanZoom + '\\';
            const filePathList = await index_js_1.default.getFilePathList(scanPath);
            let tileSet = new TileSet_js_1.default();
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
            let lackTileSet = new TileSet_js_1.default();
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
    return CheckLackTile;
});
//# sourceMappingURL=CheckLackTile.js.map