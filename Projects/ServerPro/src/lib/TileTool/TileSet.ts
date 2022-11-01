// 容纳七千万个瓦片
import Tile from './TileImpl/Tile';

class TileSet {
    public tileObj: any;

    constructor() {
        this.tileObj = {};
    }

    add(x: number, y: number, zoom: number) {
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

    delete(x: number, y: number, zoom: number) {
        if (this.tileObj[zoom] && this.tileObj[zoom][x] && this.tileObj[zoom][x][y])
            this.tileObj[zoom][x][y] = false;
    }

    getAll() {
        let result = [];
        for (const zoom in this.tileObj) {
            for (const x in this.tileObj[zoom]) {
                for (const y in this.tileObj[zoom][x]) {
                    if (this.tileObj[zoom][x][y] === true) {
                        result.push(new Tile(Number(x), Number(y), Number(zoom)));
                    }
                }
                this.tileObj[zoom][x] = {};
            }
            this.tileObj[zoom] = {};
        }
        return result;
    }
}

export = TileSet;
