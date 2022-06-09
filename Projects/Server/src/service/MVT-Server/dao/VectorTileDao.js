const {TileBox} = require('../domain/mvtTileBox.js');
const awaitWrap = require('../../../lib/awaitWrap.js');

class VectorTileDao {
    constructor(dbConnect) {
        this.dbConnect = dbConnect;
    }

    dkTile(tileBox) {
        if (!(tileBox instanceof TileBox)) throw new Error('类型错误');

        const sql = `Select ST_AsMVT (tile, '${tileBox.layerPickName}') tile 
        FROM (SELECT gid,st_asmvtgeom(t.geom,st_makeenvelope(${tileBox.xmin},${tileBox.ymin},${tileBox.xmax},${tileBox.ymax},4326),4096,0,TRUE)AS geom 
        FROM ${tileBox.tableName} t  WHERE 
        ST_Intersects ( ST_MakeEnvelope ( ${tileBox.xmin},${tileBox.ymin},${tileBox.xmax},${tileBox.ymax}, 4326 ), geom )  OR
        ST_Within ( geom, ST_MakeEnvelope ( ${tileBox.xmin},${tileBox.ymin},${tileBox.xmax},${tileBox.ymax}, 4326 ) )  OR
        ST_Within ( ST_MakeEnvelope ( ${tileBox.xmin},${tileBox.ymin},${tileBox.xmax},${tileBox.ymax}, 4326 ) , geom )
        ) AS tile 
       WHERE tile.geom IS NOT NULL;`;

        return getMvtBuffer(this.dbConnect, sql);
    }

    BoundTile(tileBox) {
        if (!(tileBox instanceof TileBox)) throw new Error('类型错误');

        const sql = `Select ST_AsMVT (tile, '${tileBox.layerPickName}') tile 
        FROM (SELECT gid,st_asmvtgeom(ST_Boundary(t.geom),st_makeenvelope(${tileBox.xmin},${tileBox.ymin},${tileBox.xmax},${tileBox.ymax},4326),4096,0,TRUE) AS geom
        FROM ${tileBox.tableName} t  WHERE 
        ST_Intersects ( ST_MakeEnvelope ( ${tileBox.xmin},${tileBox.ymin},${tileBox.xmax},${tileBox.ymax}, 4326 ), geom )  OR
        ST_Within ( geom, ST_MakeEnvelope ( ${tileBox.xmin},${tileBox.ymin},${tileBox.xmax},${tileBox.ymax}, 4326 ) )
       ) AS tile 
       WHERE 
        tile.geom IS NOT NULL;`;

        return getMvtBuffer(this.dbConnect, sql);
    }

    lineTile(tileBox) {
        if (!(tileBox instanceof TileBox)) throw new Error('类型错误');

        const sql = `    Select ST_AsMVT (tile, '${tileBox.layerPickName}') tile 
       FROM (SELECT gid,st_asmvtgeom(t.geom,st_makeenvelope(${tileBox.xmin},${tileBox.ymin},${tileBox.xmax},${tileBox.ymax},4326),4096,0,TRUE) AS geom 
        FROM ${tileBox.tableName} t  WHERE 
        ST_Intersects ( ST_MakeEnvelope ( ${tileBox.xmin},${tileBox.ymin},${tileBox.xmax},${tileBox.ymax}, 4326 ), geom )  OR
        ST_Within ( geom, ST_MakeEnvelope ( ${tileBox.xmin},${tileBox.ymin},${tileBox.xmax},${tileBox.ymax}, 4326 ) ) 
        ) AS tile 
        WHERE 
        tile.geom IS NOT NULL;"`;

        return getMvtBuffer(this.dbConnect, sql);
    }

    TextTile(tileBox) {
        if (!(tileBox instanceof TileBox)) throw new Error('类型错误');

        const sql = `    SELECT 
        ST_AsMVT ( tile, '${tileBox.layerPickName}' ) tile 
        FROM 
        ( 
        SELECT 
        ttext.gid, 
        st_asmvtgeom ( 
        ttext.geom, 
        st_makeenvelope (${tileBox.xmin},${tileBox.ymin},${tileBox.xmax},${tileBox.ymax}, 4326 ), 4096, 0, TRUE ) AS geom 
        FROM 
        ( 
           SELECT 
           gid,
           CASE
               WHEN st_within ( st_centroid ( geom ), geom ) THEN
               st_centroid ( geom ) ELSE st_pointonsurface ( geom )
           END AS geom
        FROM
        ${tileBox.tableName}
       WHERE
        ST_Within ( geom, ST_MakeEnvelope ( ${tileBox.xmin},${tileBox.ymin},${tileBox.xmax},${tileBox.ymax}, 4326 ) )
            ) AS ttext ) AS tile
       WHERE
       tile.geom IS NOT NULL;`;

        return getMvtBuffer(this.dbConnect, sql);
    }
}

async function getMvtBuffer(dbConnect, sql) {
    const [err, data] = await awaitWrap(dbConnect.any(sql));
    let tile = null;

    if (err) {
        console.log('数据库 mvt 切片失败：', err, sql);
    } else {
        tile = data[0].tile;
    }

    return tile;
}

exports.VectorTileDao = VectorTileDao;
