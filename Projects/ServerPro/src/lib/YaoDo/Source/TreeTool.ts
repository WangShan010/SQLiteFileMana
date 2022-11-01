/****************************************************************************
 名称：常用工具函数集合 - 树与数组的互转
 作者：冯功耀
 ****************************************************************************/
function array2Tree({arr, idKey = 'id', parentIdKey = 'parent_id', groupName = 'children'}: any) {
    if (!Array.isArray(arr) || !arr.length) return;
    let map: any = {};
    arr.forEach(item => map[item[idKey]] = item);

    let roots: any[] = [];
    arr.forEach(item => {
        const parent = map[item[parentIdKey]];
        if (parent) {
            (parent[groupName] || (parent[groupName] = [])).push(item);
        } else {
            roots.push(item);
        }
    });

    return roots;
}

function treeGetByID({Tree, id, idKey = 'id', parentIdKey = 'parent_id', groupName = 'children'}: any) {
    let o = {};
    Tree.forEach(function (item: any) {
        if (item.id === id) {
            o = item;
        } else if (typeof item[groupName] === 'string' && item[groupName].length > 0) {
            o = treeGetByID({Tree: item[groupName], id, idKey, parentIdKey, groupName});
        }
    });
    return o;
}

export {array2Tree, treeGetByID};
