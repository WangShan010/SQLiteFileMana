var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./TileImpl/Tile"], factory);
    }
})(function (require, exports) {
    "use strict";
    const Tile_1 = __importDefault(require("./TileImpl/Tile"));
    class TileSet {
        tileObj;
        constructor() {
            this.tileObj = {};
        }
        add(x, y, zoom) {
            let zObj = this.tileObj[zoom];
            if (!zObj) {
                zObj = {};
                this.tileObj[zoom] = zObj;
            }
            let xObj = this.tileObj[zoom][x];
            if (!xObj) {
                xObj = {};
                this.tileObj[zoom][x] = xObj;
            }
            xObj[y] = true;
        }
        delete(x, y, zoom) {
            if (this.tileObj[zoom] && this.tileObj[zoom][x] && this.tileObj[zoom][x][y])
                this.tileObj[zoom][x][y] = false;
        }
        getAll() {
            let result = [];
            for (const zoom in this.tileObj) {
                for (const x in this.tileObj[zoom]) {
                    for (const y in this.tileObj[zoom][x]) {
                        if (this.tileObj[zoom][x][y] === true) {
                            result.push(new Tile_1.default(Number(x), Number(y), Number(zoom)));
                        }
                    }
                    this.tileObj[zoom][x] = {};
                }
                this.tileObj[zoom] = {};
            }
            return result;
        }
    }
    return TileSet;
});
//# sourceMappingURL=TileSet.js.map