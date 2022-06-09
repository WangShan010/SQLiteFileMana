let DBTypeList = [
    {name: '常规归档', img: require('../../../../assets/fileMana/DBType/disk.png')},
    {name: '地图瓦片', img: require('../../../../assets/fileMana/DBType/MTS.png')},
    {name: '3DTiles', img: require('../../../../assets/fileMana/DBType/3DTiles.png')},
    {name: 'Terrain', img: require('../../../../assets/fileMana/DBType/terrain.png')}
];
let getDBTypeImg = (DBType) => {
    let tyItem = DBTypeList.find(item => DBType === item.name) || DBTypeList[0];

    return tyItem.img;
};


export {DBTypeList, getDBTypeImg};
