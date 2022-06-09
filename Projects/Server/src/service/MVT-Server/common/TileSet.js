// 容纳七千万个瓦片
class TileSet {
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

    removeAll() {
        this.zoomMap = [];
    }

    getAll() {
        let result = [];
        for (const zoom in this.tileObj) {
            for (const x in this.tileObj[zoom]) {
                for (const y in this.tileObj[zoom][x]) {
                    if (this.tileObj[zoom][x][y] === true) {
                        result.push({x, y, zoom});
                    }
                }
            }
        }

        return result;
    }

    popAll() {
        let result = [];
        for (const zoom in this.tileObj) {
            for (const x in this.tileObj[zoom]) {
                for (const y in this.tileObj[zoom][x]) {
                    if (this.tileObj[zoom][x][y] === true) {
                        result.push({x: Number(x), y: Number(y), zoom: Number(zoom)});
                    }
                }
                this.tileObj[zoom][x] = {};
            }
            this.tileObj[zoom] = {};
        }
        this.tileObj = {};
        return result;
    }
}

module.exports = TileSet;
