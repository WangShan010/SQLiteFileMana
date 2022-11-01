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
    function simplifyGeoJson(geoJson, bufferLength = 20) {
        let resGeoJson = turf.flatten(geoJson);
        while (resGeoJson.type === 'FeatureCollection' && resGeoJson.features.length > 5) {
            resGeoJson = turf.buffer(resGeoJson, bufferLength, { units: 'kilometers' });
            resGeoJson = turf.combine(resGeoJson);
            resGeoJson = turf.union(resGeoJson.features[0], resGeoJson.features[0]);
            resGeoJson = turf.flatten(resGeoJson);
        }
        resGeoJson = turf.simplify(resGeoJson, { tolerance: 0.1, highQuality: false });
        return resGeoJson;
    }
    return simplifyGeoJson;
});
//# sourceMappingURL=simplifyGeoJson.js.map