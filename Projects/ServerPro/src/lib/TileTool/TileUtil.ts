const turf = require('@turf/turf');
const TileBox = require('../../lib/TileTool/TileImpl/TileBox.js');
const twoPolygonRelation = require('./twoPolygonRelation.js');
const TileSet = require('./TileSet.js');

class TileUtil {
    constructor() {
    }

    // 待实现
    getTileXYZ(lon: number, lat: number, zoom: number) {
        console.log('未定义切片方案，需要进行重载');
    }

    // 待实现
    getRootTiles() {
        console.log('未定义切片方案，需要进行重载');
        return [];
    }

    // 待实现
    getBranchTile(xTile: number, yTile: number, zoom: number) {
        console.log('未定义切片方案，需要进行重载');
        return [];
    }

    // 待实现
    tileXYZToRectangle(x: number, y: number, zoom: number) {
        console.log('未定义切片方案，需要进行重载');
        return new TileBox();
    }

    // 待实现
    tile2lon(x: number, z: number) {
        return 0;
    }

    // 待实现
    tile2lat(y: number, z: number) {
        return 0;
    }

    getTilesByGeoJson(geoJson: any, zoom = 8, log = false) {
        geoJson = geoJson || turf.polygon([[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]]);
        geoJson = turf.flatten(geoJson);

        let tileSet = new TileSet();

        // 遍历全部的 zoom 层级
        turf.featureEach(geoJson, (currentGeometry: any) => {
            let tileMap = new Map();
            // 将根节点装入 tileMap
            this.getRootTiles().forEach((rootTile: any) => {
                rootTile.type = twoPolygonRelation(this.tileXYZToRectanglePolygon(rootTile.x, rootTile.y, rootTile.zoom), currentGeometry);
                if (rootTile.type === 'disjoint') {
                    // 跳过
                } else if (tileMap.has(rootTile.zoom)) {
                    tileMap.get(rootTile.zoom).push(rootTile);
                } else {
                    tileMap.set(rootTile.zoom, [rootTile]);
                }
            });


            for (let i = 0; i < zoom; i++) {
                let parentZoomTileList = tileMap.get(i);
                let parentZoomTileCount = parentZoomTileList.length;
                let currentZoomTileList = [] as any[];
                // 遍历当前 zoom 层级的所有瓦片，作为父级瓦片
                for (let j = 0; j < parentZoomTileList.length; j++) {
                    let parentTile = parentZoomTileList[j];
                    let branchTileList = this.getBranchTile(parentTile.x, parentTile.y, parentTile.zoom);
                    // 遍历当前父级瓦片的所有分支瓦片
                    for (let k = 0; k < branchTileList.length; k++) {
                        let branchTile = branchTileList[k];

                        if (parentTile.type === 'partIn') {
                            // @ts-ignore
                            branchTile.type = 'partIn';
                            currentZoomTileList.push(branchTile);
                        } else if (parentTile.type === 'within' || parentTile.type === 'crosses') {
                            // @ts-ignore
                            branchTile.type = twoPolygonRelation(this.tileXYZToRectanglePolygon(branchTile.x, branchTile.y, branchTile.zoom), currentGeometry);
                            // @ts-ignore
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

    tileXYZToRectanglePolygon(x: number, y: number, zoom: number) {
        const bb = this.tileXYZToRectangle(x, y, zoom);
        turf.bboxPolygon([bb.xmin, bb.ymin, bb.xmax, bb.ymax]);
        return turf.bboxPolygon([bb.xmin, bb.ymin, bb.xmax, bb.ymax]);
    }
}

export = TileUtil;
