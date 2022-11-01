class Tile {
    public x: number;
    public y: number;
    public zoom: number;

    constructor(x: number, y: number, zoom: number) {
        this.x = x;
        this.y = y;
        this.zoom = zoom;
    }
}

export = Tile;
