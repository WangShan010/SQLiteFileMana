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
    class Tile {
        x;
        y;
        zoom;
        constructor(x, y, zoom) {
            this.x = x;
            this.y = y;
            this.zoom = zoom;
        }
    }
    return Tile;
});
//# sourceMappingURL=Tile.js.map