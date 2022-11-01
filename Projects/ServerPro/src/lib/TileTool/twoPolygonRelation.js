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
    const turf = require('@turf/turf');
    function twoPolygonRelation(tilePolygon, customPolygon) {
        let relation = null;
        if (relation === null && turf.booleanContains(tilePolygon, customPolygon)) {
            relation = 'within';
        }
        if (relation === null && turf.booleanContains(customPolygon, tilePolygon)) {
            relation = 'partIn';
        }
        if (relation === null && turf.booleanDisjoint(tilePolygon, customPolygon)) {
            relation = 'disjoint';
        }
        if (relation === null && turf.booleanOverlap(tilePolygon, customPolygon)) {
            relation = 'crosses';
        }
        return relation;
    }
    return twoPolygonRelation;
});
//# sourceMappingURL=twoPolygonRelation.js.map