class MvtTileBox {
    public xmin: null;
    public ymin: null;
    public xmax: null;
    public ymax: null;
    public tableName: null;
    public layerPickName: null;

    constructor() {
        this.xmin = null;
        this.ymin = null;
        this.xmax = null;
        this.ymax = null;
        this.tableName = null;
        this.layerPickName = null;
    }
}

exports.TileBox = MvtTileBox;
