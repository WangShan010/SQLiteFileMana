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
    class TileBox {
        xmin = 0;
        ymin = 0;
        xmax = 0;
        ymax = 0;
        constructor() {
        }
    }
    return TileBox;
});
//# sourceMappingURL=TileBox.js.map