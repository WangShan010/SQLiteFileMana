(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    const TileUtil3857 = require('./TileUtil3857.js');
    function GetMapTile(leftTopLon, leftTopLat, rightBottomLon, rightBottomLat, minZoom = 0, maxZoom = 22) {
        let TileUtil = TileUtil3857;
        const zooms = [];
        if (minZoom === 0) {
            zooms.push(0);
        }
        for (let i = minZoom; i <= maxZoom; i++) {
            let l = TileUtil.getTileXYZ(leftTopLon, leftTopLat, i);
            let r = TileUtil.getTileXYZ(rightBottomLon, rightBottomLat, i);
            if (l.xTile - r.xTile !== 0 && l.yTile - r.yTile !== 0) {
                zooms.push(i);
            }
        }
        let imgListAll = [];
        while (zooms.length) {
            let zoom = zooms.shift();
            let leftTop = TileUtil.getTileXYZ(leftTopLon, leftTopLat, zoom);
            let rightBottom = TileUtil.getTileXYZ(rightBottomLon, rightBottomLat, zoom);
            for (let x = leftTop.xTile; x <= rightBottom.xTile; x++) {
                for (let y = leftTop.yTile; y <= rightBottom.yTile; y++) {
                    imgListAll.push({ x, y, zoom });
                }
            }
        }
        return imgListAll;
    }
    return GetMapTile;
});
//# sourceMappingURL=GetMapTile.js.map