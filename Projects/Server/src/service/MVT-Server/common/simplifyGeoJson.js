const turf = require('@turf/turf');

// 将 含有大量碎片化多边形的 GeoJson 进行缓冲区合并精简
function simplifyGeoJson(geoJson, bufferLength = 20) {
    let resGeoJson = turf.flatten(geoJson);

    while (resGeoJson.type === 'FeatureCollection' && resGeoJson.features.length > 5) {
        resGeoJson = turf.buffer(resGeoJson, bufferLength, {units: 'kilometers'});
        resGeoJson = turf.combine(resGeoJson);
        resGeoJson = turf.union(resGeoJson.features[0], resGeoJson.features[0]);
        resGeoJson = turf.flatten(resGeoJson);
    }

    resGeoJson = turf.simplify(resGeoJson, {tolerance: 0.1, highQuality: false});
    return resGeoJson;
}

module.exports = simplifyGeoJson;
