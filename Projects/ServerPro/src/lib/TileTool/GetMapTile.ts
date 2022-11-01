const TileUtil3857 = require('./TileUtil3857.js');

// 获取地图瓦片几何
function GetMapTile(leftTopLon: number, leftTopLat: number, rightBottomLon: number, rightBottomLat: number, minZoom = 0, maxZoom = 22) {
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
    // 根据有瓦片数据的地方下载瓦片
    let imgListAll = [];
    while (zooms.length) {
        let zoom = zooms.shift();
        let leftTop = TileUtil.getTileXYZ(leftTopLon, leftTopLat, zoom);
        let rightBottom = TileUtil.getTileXYZ(rightBottomLon, rightBottomLat, zoom);
        for (let x = leftTop.xTile; x <= rightBottom.xTile; x++) {
            for (let y = leftTop.yTile; y <= rightBottom.yTile; y++) {
                imgListAll.push({x, y, zoom});
            }
        }
    }
    return imgListAll;
}


export = GetMapTile;
