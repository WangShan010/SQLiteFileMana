<template>
  <div class="comMain">
    <div class="tip">
      <img src="../../../assets/fileMana/virtualDisk/img/img.png" height="30" width="171"/>
    </div>

    <div class="tabs">
      <div class="tab-names">
        <div :class="{'tab-active':currentTab==='文件'}" @click="currentTab='文件'">文件</div>
        <div :class="{'tab-active':currentTab==='版本号'}" @click="currentTab='版本号'">版本号</div>
        <div :class="{'tab-active':currentTab==='关于'}" @click="currentTab='关于'">关于</div>
      </div>
      <div class="tab-content">

      </div>
    </div>

    <div class="pathNav">
      <div class="pathNavTool">
        <span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>
        <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>
        <span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>
        <span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span>
      </div>
      <div class="pathBox">
        <div class="pathItem winActive" @click="comeHome">
          <img src="../../../assets/fileMana/virtualDisk/img/computer.png" height="19px" width="18px"/>
        </div>
        <div style="display: inline-block;line-height: 22px" v-for="item in currentPathItem">
          <div class="pathItem winActive" style="display: inline-block;border-radius: 3px" @click="inFolder(item.path)">
            / <span> {{ item.name }} </span>
          </div>
        </div>


        <div class="pathTool pull-right winActive" style="border-left: rgba(128, 128, 128, 0.5) 1px solid;" @click="refreshPath">
          <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>
        </div>
        <div class="pathTool pull-right winActive">
          <span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>
        </div>
      </div>
      <div class="pathSearch">
        <el-input
            size="mini"
            placeholder="搜索文件"
            prefix-icon="el-icon-search">
          <!--            v-model="input4"-->
        </el-input>
      </div>
    </div>

    <div class="fileExplorer">
      <div class="row">
        <div class="col-xs-2">
          <div class="comLeft">
            <div style="overflow: auto;padding: 10px">
              <button class="btn btn-default btn-sm" :disabled="runTask"
                      data-toggle="modal" data-target="#groupMana">建组
              </button>
              <button class="btn btn-default btn-sm" :disabled="runTask"
                      data-toggle="modal" data-target="#addDB">建库
              </button>
              <button class="btn btn-default btn-sm" :disabled="runTask"
                      data-toggle="modal" data-target="#exportDB">导出
              </button>
            </div>
            <!-- <el-tree :data="pathTree" :props="pathTree"></el-tree> -->
          </div>
        </div>
        <div class="col-xs-7 explorer-content" v-if="fileExplorerModel==='home'">
          <div class="diskList">
            <div class="diskGroup">
              <div class="diskGroup-head" onclick="$('.diskGroup-content').slideToggle('fast')">
                <span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
                <span style="font-size: 15px;color: #1e3287">通用资源（{{ DBList.length }}）</span>
              </div>
              <div class="diskGroup-content">
                <div class="diskItem winActive" v-for="item in DBList" :key="item.id" @dblclick="inDBFile(item.fileName)">
                  <div class="row">
                    <div class="col-xs-1 disk-icon">
                      <img src="../../../assets/fileMana/virtualDisk/img/c.png">
                    </div>
                    <div class="col-xs-1 disk-info">
                      <div class="disk-name">{{ item.fileName }}</div>
                      <div class="disk-volume">
                        <div style="background-color: #26a0da;height: 14px;display: inline-block"
                             :style="{'width':(item.size/DBSunSize*100)+'%'}"></div>
                      </div>
                      <div class="disk-text">占用 {{ item.sizeFormat }} 磁盘空间</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xs-7 explorer-content" v-if="fileExplorerModel==='search'">
          <div class="fileList">
            <table>
              <tr>
                <th>名称</th>
                <th width="80">大小</th>
                <th width="250">MD5</th>
              </tr>
              <tr class="winActive" v-for="item in fileList"
                  @click="chooseFile(item)" @dblclick="inFolder(item.file_path_location)"
                  :class="{'select':item.file_path_location===selPath && item.file_name===selFileName}"
              >
                <td>
                  <img v-if="item.ext==='directory'" src="../../../assets/fileMana/fileType/directory.png" width="20">
                  <img v-if="item.ext==='cpp'" src="../../../assets/fileMana/fileType/cpp.png" width="20">
                  <img v-if="item.ext==='css'" src="../../../assets/fileMana/fileType/css.png" width="20">
                  <img v-if="item.ext==='doc'" src="../../../assets/fileMana/fileType/doc.png" width="20">
                  <img v-if="item.ext==='docx'" src="../../../assets/fileMana/fileType/docx.png" width="20">
                  <img v-if="item.ext==='exe'" src="../../../assets/fileMana/fileType/exe.png" width="20">
                  <img v-if="item.ext==='html'" src="../../../assets/fileMana/fileType/html.png" width="20">
                  <img v-if="item.ext==='jpeg'" src="../../../assets/fileMana/fileType/jpeg.png" width="20">
                  <img v-if="item.ext==='jpg'" src="../../../assets/fileMana/fileType/jpg.png" width="20">
                  <img v-if="item.ext==='js'" src="../../../assets/fileMana/fileType/js.png" width="20">
                  <img v-if="item.ext==='md'" src="../../../assets/fileMana/fileType/md.png" width="20">
                  <img v-if="item.ext==='mp3'" src="../../../assets/fileMana/fileType/mp3.png" width="20">
                  <img v-if="item.ext==='mp4'" src="../../../assets/fileMana/fileType/mp4.png" width="20">
                  <img v-if="item.ext==='pages'" src="../../../assets/fileMana/fileType/pages.png" width="20">
                  <img v-if="item.ext==='pdf'" src="../../../assets/fileMana/fileType/pdf.png" width="20">
                  <img v-if="item.ext==='png'" src="../../../assets/fileMana/fileType/png.png" width="20">
                  <img v-if="item.ext==='py'" src="../../../assets/fileMana/fileType/py.png" width="20">
                  <img v-if="item.ext==='rar'" src="../../../assets/fileMana/fileType/rar.png" width="20">
                  <img v-if="item.ext==='txt'" src="../../../assets/fileMana/fileType/txt.png" width="20">
                  <img v-if="item.ext==='wav'" src="../../../assets/fileMana/fileType/wav.png" width="20">
                  <img v-if="item.ext==='xls'" src="../../../assets/fileMana/fileType/xls.png" width="20">
                  <img v-if="item.ext==='xml'" src="../../../assets/fileMana/fileType/xml.png" width="20">
                  <img v-if="item.ext==='zip'" src="../../../assets/fileMana/fileType/zip.png" width="20">
                  <img v-if="item.ext==='file'" src="../../../assets/fileMana/fileType/file.png" width="20">
                  {{ item.file_name }}
                </td>
                <td>{{ item.file_size }}&nbsp;kb</td>
                <td>{{ item.file_md5 }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="col-xs-3" style="padding:0 10px">
          <h2>预览</h2>
          <a href="#" class="thumbnail">
            <img style="width: 100%; display: block;"
                 src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTcxIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDE3MSAxODAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzEwMCV4MTgwCkNyZWF0ZWQgd2l0aCBIb2xkZXIuanMgMi42LjAuCkxlYXJuIG1vcmUgYXQgaHR0cDovL2hvbGRlcmpzLmNvbQooYykgMjAxMi0yMDE1IEl2YW4gTWFsb3BpbnNreSAtIGh0dHA6Ly9pbXNreS5jbwotLT48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWyNob2xkZXJfMTdkOTA0OGIyMDcgdGV4dCB7IGZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxMHB0IH0gXV0+PC9zdHlsZT48L2RlZnM+PGcgaWQ9ImhvbGRlcl8xN2Q5MDQ4YjIwNyI+PHJlY3Qgd2lkdGg9IjE3MSIgaGVpZ2h0PSIxODAiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSI1OSIgeT0iOTQuNSI+MTcxeDE4MDwvdGV4dD48L2c+PC9nPjwvc3ZnPg=="
                 data-holder-rendered="true">
          </a>
        </div>
      </div>
    </div>

    <div class="foot">
      <span style="padding-right: 18px">{{ fileList.length }}&nbsp;&nbsp;个项目</span>

      <div class="progress" style="position: fixed;bottom:12px;left:200px;display: inline-block;height:8px;width: 650px;margin: 0">
        <div class="progress-bar progress-bar-success progress-bar-striped active" :style="{width: runProgress+'%'}"></div>
      </div>
    </div>

    <!-- 分组管理 -->
    <div class="modal fade" id="groupMana" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">分组管理</h4>
          </div>
          <div class="modal-body">
            <table class="table table-bordered">
              <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
            <button type="button" class="btn btn-primary">保存</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新建资源库 -->
    <div class="modal fade" id="addDB" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">新建资源库</h4>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>所属分组</label>
              <select class="form-control">
                <option>通用资源</option>
              </select>
            </div>
            <div class="form-group">
              <label>资源库名称</label>
              <input class="form-control" placeholder="请输入资源库名称" v-model="createdDBProps.DBName">
            </div>
            <div class="form-group">
              <label>映射目录</label>
              <div class="input-group">
                <input type="text" class="form-control input-sm" disabled v-model="createdDBProps.targetDirectory">
                <span class="input-group-btn">
                  <button class="btn btn-default btn-sm" type="button" @click="changeCreatePath">更改</button>
                </span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" @click="createDB">新增</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 导出文件 -->
    <div class="modal fade" id="exportDB" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">导出文件</h4>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>资源库</label>
              <select class="form-control" v-model="exportDBProps.DBName">
                <option v-for="item in DBList" :key="item.id">{{ item.fileName }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>保存位置</label>
              <div class="input-group">
                <input type="text" class="form-control" disabled v-model="exportDBProps.targetDirectory">
                <span class="input-group-btn">
                  <button class="btn btn-default" type="button" @click="changeSavePath">更改</button>
                </span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" @click="exportDB">导出</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from '@/assets/fileMana/js/API.js';

export default {
  name: 'virtualDisk',
  data: function () {
    return {
      currentTab: '文件',
      DBList: [],
      // 页面主体的模式，home：首页，search：搜索结果
      fileExplorerModel: 'home',

      runTask: false,                 // 后端是否正在跑程序
      runProgress: 0,                 // 程序的进度

      currentDBName: '',              // 当前正打开的 数据库名
      currentPath: '',                // 当前界面的 路径
      selPath: '',                    // 当前被选中的文件 路径
      selFileName: '',                // 当前被选中的文件 名称
      selFilePath: '',                // 当前被选中的文件 路径

      fileList: [],                   // 当前路径下的文件列表

      pathTree: [{
        children: 'children',
        label: 'label'
      }],


      // 创建资源库的参数
      createdDBProps: {
        DBName: '',
        targetDirectory: ''
      },
      // 导出资源库的参数
      exportDBProps: {
        DBName: '',
        targetDirectory: ''
      }
    };
  },
  computed: {
    DBSunSize() {
      let size = 0;
      this.DBList.forEach(db => {
        size += db.size;
      });
      return size;
    },
    currentPathItem() {
      if (!this.currentPath) {
        return [];
      } else {
        let pathItems = this.currentPath.split('\\').filter(i => i !== '');
        let itemList = [];

        for (let i = 0; i < pathItems.length; i++) {
          let path = pathItems.slice(1, i + 1).join('\\') || '\\';
          itemList.push({
            name: pathItems[i],
            path: path === '\\' ? '\\' : '\\' + path + '\\'
          });
        }

        return itemList;
      }
    }
  },
  methods: {
    // 返回首页
    comeHome() {
      this.fileExplorerModel = 'home';
      this.currentDBName = '';
      this.currentPath = '';
      this.selPath = '';
      this.selFileName = '';
    },
    // 进入数据库
    async inDBFile(DBName) {
      this.fileExplorerModel = 'search';
      this.currentDBName = DBName;
      this.currentPath = DBName + '\\';
      this.selPath = '';
      this.selFileName = '';
      this.fileList = await API.getFileListByPath(DBName, '\\');
    },
    // 进入文件夹
    async inFolder(path) {
      this.currentPath = this.currentDBName + '\\' + path;
      this.selPath = '';
      this.selFileName = '';
      this.fileList = await API.getFileListByPath(this.currentDBName, path);
    },
    // 刷新当前路径
    async refreshPath() {
      this.DBList = await API.getDBList();
    },
    // 获取目录树
    async getDBPathTree(DBName) {
      this.pathTree = await API.getDBPathTree(DBName);
      console.log('目录树', this.pathTree);
    },
    // 选取文件
    async chooseFile(e) {
      this.selPath = e.file_path_location;
      this.selFileName = e.file_name;
      this.selFilePath = e.file_full_path;
      if (this.selFilePath) {
        await this.previewFile(this.selFilePath);
      }
    },
    async previewFile(fullPath) {

    },

    async changeSavePath() {
      let path = await API.choosePath();
      this.exportDBProps.targetDirectory = path || this.exportDBProps.targetDirectory;
    },
    async changeCreatePath() {
      let path = await API.choosePath();
      this.createdDBProps.targetDirectory = path || this.createdDBProps.targetDirectory;
    },

    // 创建资源库
    async createDB() {
      let that = this;
      that.runTask = true;
      await API.createDB(this.createdDBProps.targetDirectory, this.createdDBProps.DBName);
      that.createdDBProps = {DBName: '', targetDirectory: ''};
    },
    // 导出资源库
    async exportDB() {
      let that = this;
      that.runTask = true;
      await API.exportDB(this.exportDBProps.targetDirectory, this.exportDBProps.DBName);
      that.exportDBProps = {DBName: '', targetDirectory: ''};
    },

    // 添加监听
    async monitorProgress() {
      let that = this;
      window.clientWebSocketTool.addListen('runProgress', function (json) {
        that.runProgress = json.completed / json.total * 100;
        if (json.completed === json.total) {
          that.runTask = false;
          that.runProgress = 0;
        }
        console.log(that.runProgress);
      });
    }
  },
  async mounted() {
    let that = this;
    await that.monitorProgress();
    await that.refreshPath();

    // await this.getDBPathTree(this.DBList[0].label);

    setInterval(function () {
      that.refreshPath();
    }, 500);
  }
};
</script>

<style scoped lang="less">
@import "./virtualDisk.css";

.winActive {
  border: 1px solid transparent;
}

.winActive:hover {
  background-color: #e3f1fd;
}

.winActive:active {
  background-color: #cbe7fe;
  box-shadow: 0 0 0 1px #98d0fe;
  outline: 1px solid #98d0fe;
}

.select {
  background-color: #cbe7fe;
  box-shadow: 0 0 0 1px #98d0fe;
  outline: 1px solid #98d0fe;
}

.comMain {
  height: calc(100% - 2px);
}

.tabs {
  height: 26px;
  margin: 1px 0 3px 1px;
  border-bottom: 1px silver solid;

  .tab-names div {
    display: inline-block;
    text-align: center;
    padding: 3px 16px;
    font-size: 12px;
    cursor: pointer;
  }

  .tab-active {
    background-color: #0165c3;
    color: white;
  }
}


.pathNav {
  height: 28px;


  .pathNavTool {
    display: inline-block;
    width: 110px;
    height: 100%;

    span {
      color: #808080;
      font-size: 13px;
      width: 20%;
      text-align: center;
    }

    span:hover {
      color: #98d0fe;
    }
  }

  .pathBox {
    display: inline-block;
    border: 1px silver solid;
    height: 30px;
    width: calc(100% - 420px);
    border-radius: 2px;


    .pathItem {
      display: inline-block;
      padding: 2px 2px;
      height: 100%;
      cursor: pointer;
      border: 1px solid transparent;
      font-size: 12px;
    }

    .pathTool {
      display: inline-block;
      width: 30px;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      vertical-align: center;
      text-align: center
    }
  }

  .pathSearch {
    display: inline-block;
    width: 300px;

    input {
      height: 30px;
    }
  }
}


.fileExplorer {
  height: calc(100% - 112px);
  margin-top: 6px;
  overflow: auto;


  .comLeft {
    display: inline-block;
    width: 100%;
    height: calc(100% - 5px);
    overflow: auto;
    padding-right: 2px;
  }

  .explorer-content {
    border-left: 1px rgba(192, 192, 192, 0.42) solid;
    border-right: 1px rgba(192, 192, 192, 0.42) solid;
  }

  .diskList {
    display: inline-block;
    width: 100%;
    height: calc(100%);
    padding: 2px;

    .diskGroup {

      .diskGroup-head {
        height: 28px;
        padding: 3px 3px;
      }

      .diskGroup-head:hover {
        background-color: #e3f1fd;
      }

      .diskGroup-content {
        padding-top: 2px;
        padding-left: 10px;
      }

      .diskItem {
        width: 253px;
        height: 60px;
        font-size: 0;
        border-radius: 1px;
        display: inline-block;
        cursor: pointer;
        padding-right: 3px;
        border: 1px solid transparent;

        .disk-icon {
          display: inline-block;
          width: 56px;
          padding: 4px;
          height: 100%;
          font-size: 11px;

          img {
            border-radius: 50%;
            width: 48px;
            height: 48px;
          }
        }

        .disk-info {
          display: inline-block;
          font-size: 11px;
          width: 190px;

          .disk-name {
            padding: 2px 0;
            font-size: 13px;
          }

          .disk-volume {
            border: 1px silver solid;
            background-color: #e5e5e5;
            font-size: 0;
          }

          .disk-text {
            padding: 2px 0;
            font-size: 12px;
            color: #6d6d6d;
          }
        }
      }
    }
  }

  .fileList {
    padding-left: 10px;
    margin-right: 5px;
    height: 100%;
    overflow: auto;

    table {
      width: 100%;

      th {
        padding: 2px 2px 2px 6px;
        border-right: 1px rgba(192, 192, 192, 0.42) solid;
        font-weight: normal;
        font-size: 13px;
      }

      td {
        padding: 2px 2px 2px 6px;
        font-size: 13px;
      }
    }
  }
}


.foot {
  height: 25px;
  padding: 3px 0 3px 11px;
  font-size: 12px;
}
</style>
