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
    let GISTool = {
        calcTriangleArea(s1, s2, s3) {
            if (s1 < 0 || s2 < 0 || s3 < 0) {
                return 0;
            }
            if (!((s1 + s2 > s3) && (s1 + s3 > s2) && (s2 + s3 > s1))) {
                return 0;
            }
            if (!((s1 - s2 < s3) && (s2 - s1 < s3) && (s1 - s3 < s2) && (s3 - s1 < s2) && (s2 - s3 < s1) && (s3 - s2 < s1))) {
                return 0;
            }
            let s = (s1 + s2 + s3) / 2;
            return Math.sqrt(s * (s - s1) * (s - s2) * (s - s3));
        },
        VecAngle(X1, Y1, X2, Y2) {
            let deltaX, deltaY;
            deltaX = X2 - X1;
            deltaY = Y2 - Y1;
            return this.NormalizeVecAngle(Math.atan2(deltaY, deltaX));
        },
        NormalizeVecAngle(angle) {
            let count = ~~(angle / (2 * Math.PI));
            return (angle - count * (2 * Math.PI));
        },
        GeoAlgorithm(direct1, direct2) {
            return this.NormalizeVecAngle(direct2 - direct1);
        }
    };
    return GISTool;
});
//# sourceMappingURL=GISTool.js.map