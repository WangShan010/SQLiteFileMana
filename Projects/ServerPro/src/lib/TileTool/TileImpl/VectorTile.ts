class VectorTile {
    public id: null;
    public name: null;
    public geom: null;
    public tile: any[];

    constructor() {
        this.id = null;
        this.name = null;
        this.geom = null;
        this.tile = [];
    }
}

exports.VectorTile = VectorTile;
