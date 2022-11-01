const turf = require('@turf/turf');

function unionGeoJson(geoJson: any) {
    let sourceGeoJson = turf.flatten(geoJson);

    let resGeoJson: any;
    turf.featureEach(sourceGeoJson, function (currentFeature: any, featureIndex: number) {
        if (featureIndex === 0) {
            resGeoJson = currentFeature;
        } else {
            resGeoJson = turf.union(resGeoJson, currentFeature);
        }
    });

    return turf.flatten(resGeoJson);
}

export = unionGeoJson;
