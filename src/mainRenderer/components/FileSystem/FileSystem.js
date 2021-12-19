const dialog = require('electron').dialog;
const exec = require('child_process').exec;
const nodeCmd = require('node-cmd');
let FileSystemTool = {};

// 文件夹选取框
FileSystemTool.choosePathDialog = async function () {
    let paths = await dialog.showOpenDialog({properties: ['openDirectory']});
    let path = paths.filePaths.pop();
    return path;
};

// 文件选择器，加载 .gisFileDB 文件
FileSystemTool.chooseFileDBDialog = async function () {
    let paths = await dialog.showOpenDialog({
        title: '打开数据库文件',
        filters: [{
            name: 'gisFileDB',
            extensions: ['gisFileDB']
        }]
    });
    let filePath = paths.filePaths.pop();
    return filePath;
};

// 打开文件夹
FileSystemTool.openCatalogue = async function (path) {
    exec(`explorer.exe /select,${path}`);
};

FileSystemTool.openFile = async function (path) {
    nodeCmd.run('D:\\SQLiteFileMana\\FileResources\\DEM-wordHeights\\3\\-1\\7.terrain', function (e) {
        console.log(e);
    });
};


module.exports = FileSystemTool;
