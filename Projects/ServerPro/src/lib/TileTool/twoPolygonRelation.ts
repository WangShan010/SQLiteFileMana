const turf = require('@turf/turf');

// 传入瓦片的矩形 polygon 、自定义多边形的 polygon，判断它们之间的关系
function twoPolygonRelation(tilePolygon: any, customPolygon: any) {
    let relation = null;

    // customPolygon 完全位于 tilePolygon 中
    if (relation === null && turf.booleanContains(tilePolygon, customPolygon)) {
        relation = 'within';
    }

    // tilePolygon 完全位于 customPolygon 中
    if (relation === null && turf.booleanContains(customPolygon, tilePolygon)) {
        relation = 'partIn';
    }

    // 当这两个矢量相离时
    if (relation === null && turf.booleanDisjoint(tilePolygon, customPolygon)) {
        relation = 'disjoint';
    }

    // 当这两个矢量相交时
    if (relation === null && turf.booleanOverlap(tilePolygon, customPolygon)) {
        relation = 'crosses';
    }

    return relation;
}

export = twoPolygonRelation;
