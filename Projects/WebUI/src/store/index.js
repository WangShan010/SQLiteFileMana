import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let store = new Vuex.Store({
    state: {
        serverInfo: null,
        DBList: [],
        fileList: [],
        groupList: [
            {name: '通用资源', sum: 0}
        ],

        // 页面显示模式，diskInfo：首页，search：搜索结果，fileList：文件详情
        fileExplorerModel: 'diskInfo',

        selDBName: '',
        selFileName: '',

        currentDB: 'assets.cesium.com',
        currentPath: null,
        currentFile: null,

        isRunning: false,
        runProgress: 0
    },
    getters: {
        DBSunSize(state) {
            let size = 0;
            state.DBList.forEach(db => {
                size += db.size;
            });
            return size;
        },
        fileListLength(state) {
            return state.fileList.length;
        },
        currentPathItem(state) {
            if (!state.currentPath) {
                return [];
            } else {
                let pathItems = state.currentPath.split('\\').filter(i => i !== '');
                let itemList = [];

                for (let i = 0; i < pathItems.length; i++) {
                    let path = pathItems.slice(1, i + 1).join('\\') || '\\';
                    itemList.push({
                        name: pathItems[i],
                        path: path === '\\' ? '\\' : '\\' + path + '\\'
                    });
                }

                return itemList || [];
            }
        }
    },
    mutations: {
        setServerInfo(state, serverInfo) {
            state.serverInfo = serverInfo;
        },
        setDBList(state, DBList) {
            state.DBList = DBList ? DBList : [];

            // 文件组重新计数
            state.groupList.map(group => {
                group.sum = 0;
                return group;
            });

            // 开始分组计数
            state.DBList.forEach(DBItem => {
                let hasGroup = state.groupList.some(groupItem => {
                    groupItem.sum++;
                    return groupItem.name === DBItem.mataData.DBGroup;
                });
                if (!hasGroup) {
                    state.groupList.push({
                        name: DBItem.mataData.DBGroup,
                        sum: 1
                    });
                }
            });
        },
        setFileList(state, fileList) {
            state.fileList = fileList ? fileList : [];
        },
        setFileExplorerModel(state, model) {
            state.fileExplorerModel = model;
        },
        setSelDBName(state, selDBName) {
            state.selDBName = selDBName;
        },
        setSelFileName(state, selFileName) {
            state.selFileName = selFileName;
        },
        setCurrentDB(state, currentDB) {
            state.currentDB = currentDB;
        },
        setCurrentPath(state, currentPath) {
            state.currentPath = state.currentDB + currentPath;
        },
        setCurrentFile(state, currentFile) {
            state.currentFile = currentFile;
        },
        setIsRunning(state, isRunning) {
            state.isRunning = isRunning;
        },
        setRunProgress(state, runProgress) {
            state.runProgress = runProgress;
        },
        addGroup(state, groupName) {
            let has = state.groupList.some(item => item.name === groupName);
            has === false && state.groupList.push({name: groupName, sum: 0});
        }
    }
});


export default store;
