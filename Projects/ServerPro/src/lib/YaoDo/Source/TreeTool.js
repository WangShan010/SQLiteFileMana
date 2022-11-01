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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.treeGetByID = exports.array2Tree = void 0;
    function array2Tree({ arr, idKey = 'id', parentIdKey = 'parent_id', groupName = 'children' }) {
        if (!Array.isArray(arr) || !arr.length)
            return;
        let map = {};
        arr.forEach(item => map[item[idKey]] = item);
        let roots = [];
        arr.forEach(item => {
            const parent = map[item[parentIdKey]];
            if (parent) {
                (parent[groupName] || (parent[groupName] = [])).push(item);
            }
            else {
                roots.push(item);
            }
        });
        return roots;
    }
    exports.array2Tree = array2Tree;
    function treeGetByID({ Tree, id, idKey = 'id', parentIdKey = 'parent_id', groupName = 'children' }) {
        let o = {};
        Tree.forEach(function (item) {
            if (item.id === id) {
                o = item;
            }
            else if (typeof item[groupName] === 'string' && item[groupName].length > 0) {
                o = treeGetByID({ Tree: item[groupName], id, idKey, parentIdKey, groupName });
            }
        });
        return o;
    }
    exports.treeGetByID = treeGetByID;
});
//# sourceMappingURL=TreeTool.js.map