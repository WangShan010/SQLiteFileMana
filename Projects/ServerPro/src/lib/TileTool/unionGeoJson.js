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
    function unionGeoJson(geoJson) {
        let sourceGeoJson = turf.flatten(geoJson);
        let resGeoJson;
        turf.featureEach(sourceGeoJson, function (currentFeature, featureIndex) {
            if (featureIndex === 0) {
                resGeoJson = currentFeature;
            }
            else {
                resGeoJson = turf.union(resGeoJson, currentFeature);
            }
        });
        return turf.flatten(resGeoJson);
    }
    return unionGeoJson;
});
//# sourceMappingURL=unionGeoJson.js.map