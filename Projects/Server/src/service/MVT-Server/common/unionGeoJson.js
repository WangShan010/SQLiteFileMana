const turf = require('@turf/turf');

function unionGeoJson(geoJson) {
    let sourceGeoJson = turf.flatten(geoJson);

    let resGeoJson;
    turf.featureEach(sourceGeoJson, function (currentFeature, featureIndex) {
        if (featureIndex === 0) {
            resGeoJson = currentFeature;
        } else {
            resGeoJson = turf.union(resGeoJson, currentFeature);
        }
    });

    return turf.flatten(resGeoJson);
}

module.exports = unionGeoJson;
