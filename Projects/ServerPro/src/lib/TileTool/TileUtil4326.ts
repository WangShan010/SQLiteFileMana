const axios = require('axios');
const Cesium = require('cesium/Build/Cesium/index.cjs');
import TileBox from '../../lib/TileTool/TileImpl/TileBox.js';
import awaitWrap from '../awaitWrap.js';

const TileUtil = require('./TileUtil.js');

let tilingScheme = new Cesium.GeographicTilingScheme({
    numberOfLevelZeroTilesX: 2, numberOfLevelZeroTilesY: 1
});


class TileUtil4326 extends TileUtil {
    constructor() {
        super();
    }

    getTileXYZ(lon: number, lat: number, zoom: number) {
        let c = Cesium.Cartographic.fromDegrees(lon, lat);
        let {x, y} = tilingScheme.positionToTileXY(c, zoom);

        // TileMapService方案从左下角开始计数
        const yTiles = tilingScheme.getNumberOfYTilesAtLevel(zoom);
        y = yTiles - y - 1;

        // WG84 瓦片：计算公式：
        // n = 2 (zoom+1)
        // xTile = ((lon_deg + 180) / 360) * n
        // yTile=（(lat_deg + 90) / 360）*n
        // 原生方案：
        // let xTile = Math.floor((lon + 180) / 360 * (1 << (zoom + 1)));
        // let yTile = Math.floor(((lat + 90) / 360) * (1 << (zoom + 1)));

        return {xTile: x, yTile: y, zoom};
    }

    getRootTiles() {
        return [{x: 0, y: 0, zoom: 0}, {x: 1, y: 0, zoom: 0}];
    }

    getBranchTile(xTile: number, yTile: number, zoom: number) {
        let list = [];

        list.push({x: xTile * 2, y: yTile * 2, zoom: zoom + 1});
        list.push({x: xTile * 2 + 1, y: yTile * 2, zoom: zoom + 1});
        list.push({x: xTile * 2, y: yTile * 2 + 1, zoom: zoom + 1});
        list.push({x: xTile * 2 + 1, y: yTile * 2 + 1, zoom: zoom + 1});

        return list;
    }

    tileXYZToRectangle(x: number, y: number, zoom: number) {
        let react = tilingScheme.tileXYToRectangle(x, y, zoom);
        let tileBox = new TileBox();
        tileBox.xmin = react.west * 180 / Math.PI;
        tileBox.ymin = react.south * 180 / Math.PI;
        tileBox.xmax = react.east * 180 / Math.PI;
        tileBox.ymax = react.north * 180 / Math.PI;
        return tileBox;
    }

    tile2lon(x: number, z: number) {
        return x / Math.pow(2.0, (z + 1)) * 360.0 - 180;
    }

    tile2lat(y: number, z: number) {
        return y / Math.pow(2.0, (z + 1)) * 360.0 - 90;
    }

    async loadTile(tileRootPath: string, minZoom: number, maxZoom: number, geoJson: any, log = false) {
        let tileList = await this.checkLackTile(tileRootPath, minZoom, maxZoom, geoJson, log);
        let map = new Map();
        for (let i = 0; i < tileList.length; i++) {
            let tile = tileList[i];
            map.set(i, awaitWrap(axios.get(`http://localhost:3000/cacheServer/assets.cesium.com/1/${tile.zoom}/${tile.x}/${tile.y}.terrain`).then(() => {
                map.delete(i);
                if (i % 100 === 0) {
                    console.log('已完成', i, '/', tileList.length, i / tileList.length * 100 + '%');
                }
            }).catch((e: any) => {
                map.delete(i);
                console.log('请求失败', `${tile.zoom}/${tile.x}/${tile.y}.terrain`);
            })));

            if (map.size >= 10) {
                await Promise.race(Array.from(map.values()));
            }
        }
    }
}

export = new TileUtil4326();
