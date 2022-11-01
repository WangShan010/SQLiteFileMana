var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../lib/TileTool/TileImpl/TileBox.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    const TileBox_js_1 = __importDefault(require("../../lib/TileTool/TileImpl/TileBox.js"));
    const TileUtil = require('./TileUtil.js');
    class TileUtil3857 extends TileUtil {
        constructor() {
            super();
        }
        getTileXYZ(lon, lat, zoom) {
            let xTile = Math.floor((lon + 180) / 360 * (1 << zoom));
            let yTile = Math.floor((1 - Math.log(Math.tan(lat * (Math.PI / 180)) + 1 / Math.cos(lat * (Math.PI / 180))) / Math.PI) / 2 * (1 << zoom));
            if (xTile < 0) {
                xTile = 0;
            }
            if (xTile >= (1 << zoom)) {
                xTile = ((1 << zoom) - 1);
            }
            if (yTile < 0) {
                yTile = 0;
            }
            if (yTile >= (1 << zoom)) {
                yTile = ((1 << zoom) - 1);
            }
            return { x: xTile, y: yTile, zoom };
        }
        getRootTiles() {
            return [{ x: 0, y: 0, zoom: 0 }];
        }
        getBranchTile(xTile, yTile, zoom) {
            let list = [];
            for (let i = 0; i < 4; i++) {
                let x = xTile * 2 + (i % 2);
                let y = yTile * 2 + Math.floor(i / 2);
                list.push({ x, y, zoom: zoom + 1 });
            }
            return list;
        }
        tileXYZToRectangle(x, y, zoom) {
            const bb = new TileBox_js_1.default();
            bb.ymax = this.tile2lat(y, zoom);
            bb.ymin = this.tile2lat(y + 1, zoom);
            bb.xmin = this.tile2lon(x, zoom);
            bb.xmax = this.tile2lon(x + 1, zoom);
            return bb;
        }
        tile2lon(x, z) {
            return x / Math.pow(2.0, z) * 360.0 - 180;
        }
        tile2lat(y, z) {
            const n = Math.PI - (2.0 * Math.PI * y) / Math.pow(2.0, z);
            return (180 / Math.PI * Math.atan(Math.sinh(n)));
        }
    }
    return new TileUtil3857();
});
//# sourceMappingURL=TileUtil3857.js.map