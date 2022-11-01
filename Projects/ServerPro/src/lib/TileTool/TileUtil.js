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
    const turf = require('@turf/turf');
    const TileBox = require('../../lib/TileTool/TileImpl/TileBox.js');
    const twoPolygonRelation = require('./twoPolygonRelation.js');
    const TileSet = require('./TileSet.js');
    class TileUtil {
        constructor() {
        }
        getTileXYZ(lon, lat, zoom) {
            console.log('未定义切片方案，需要进行重载');
        }
        getRootTiles() {
            console.log('未定义切片方案，需要进行重载');
            return [];
        }
        getBranchTile(xTile, yTile, zoom) {
            console.log('未定义切片方案，需要进行重载');
            return [];
        }
        tileXYZToRectangle(x, y, zoom) {
            console.log('未定义切片方案，需要进行重载');
            return new TileBox();
        }
        tile2lon(x, z) {
            return 0;
        }
        tile2lat(y, z) {
            return 0;
        }
        getTilesByGeoJson(geoJson, zoom = 8, log = false) {
            geoJson = geoJson || turf.polygon([[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]]);
            geoJson = turf.flatten(geoJson);
            let tileSet = new TileSet();
            turf.featureEach(geoJson, (currentGeometry) => {
                let tileMap = new Map();
                this.getRootTiles().forEach((rootTile) => {
                    rootTile.type = twoPolygonRelation(this.tileXYZToRectanglePolygon(rootTile.x, rootTile.y, rootTile.zoom), currentGeometry);
                    if (rootTile.type === 'disjoint') {
                    }
                    else if (tileMap.has(rootTile.zoom)) {
                        tileMap.get(rootTile.zoom).push(rootTile);
                    }
                    else {
                        tileMap.set(rootTile.zoom, [rootTile]);
                    }
                });
                for (let i = 0; i < zoom; i++) {
                    let parentZoomTileList = tileMap.get(i);
                    let parentZoomTileCount = parentZoomTileList.length;
                    let currentZoomTileList = [];
                    for (let j = 0; j < parentZoomTileList.length; j++) {
                        let parentTile = parentZoomTileList[j];
                        let branchTileList = this.getBranchTile(parentTile.x, parentTile.y, parentTile.zoom);
                        for (let k = 0; k < branchTileList.length; k++) {
                            let branchTile = branchTileList[k];
                            if (parentTile.type === 'partIn') {
                                branchTile.type = 'partIn';
                                currentZoomTileList.push(branchTile);
                            }
                            else if (parentTile.type === 'within' || parentTile.type === 'crosses') {
                                branchTile.type = twoPolygonRelation(this.tileXYZToRectanglePolygon(branchTile.x, branchTile.y, branchTile.zoom), currentGeometry);
                                if (branchTile.type !== 'disjoint') {
                                    currentZoomTileList.push(branchTile);
                                }
                            }
                        }
                        if (Math.floor(parentZoomTileCount / 20_0000) && j % Math.ceil(parentZoomTileCount / 100) === 0) {
                            log && console.log('zoom：', i + 1, '，统计进度：', Math.ceil(j / parentZoomTileCount * 100) + '%');
                        }
                    }
                    tileMap.set(i + 1, currentZoomTileList);
                }
                [...tileMap.values()].forEach(function (tileList) {
                    while (tileList.length) {
                        let tile = tileList.pop();
                        tile.zoom === zoom && tileSet.add(tile.x, tile.y, tile.zoom);
                    }
                });
            });
            return tileSet.getAll();
        }
        tileXYZToRectanglePolygon(x, y, zoom) {
            const bb = this.tileXYZToRectangle(x, y, zoom);
            turf.bboxPolygon([bb.xmin, bb.ymin, bb.xmax, bb.ymax]);
            return turf.bboxPolygon([bb.xmin, bb.ymin, bb.xmax, bb.ymax]);
        }
    }
    return TileUtil;
});
//# sourceMappingURL=TileUtil.js.map