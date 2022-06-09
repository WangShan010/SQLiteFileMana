const {VectorTileController} = require('./controller/VectorTileController.js');

// const db = require('../HN-pgSqlAPI/Core/dbConnect.js');

// async function test () {
//   const vec = new VectorTileController(db);
//   const tile = await vec.getMVT({
//     layerPickName: '三调数据',
//     type: 'bound',
//     table: 'basic_map.polygon_shi',
//     z: 6,
//     x: 52,
//     y: 25
//   });
//   console.log(tile.length);
// }
//
// test();

module.exports = VectorTileController;
