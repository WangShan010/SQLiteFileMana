<template>
  <el-col class="comMain">
    <!-- 文件浏览页面 -->
    <el-row class="fileExplorer">
      <div class="pathNav">
        <div class="pathBox">
          <div id="pathRoot" class="pathItem winActive" @click="comeHome">
            <img src="../../../assets/fileMana/virtualDisk/img/computer.png"/>
          </div>
          <div id="pathList" v-for="item in currentPathItem">
            <div class="pathItem winActive" style="display: inline-block;border-radius: 3px"
                 @click="inFolder(item.path)">
              / <span> {{ item.name }} </span>
            </div>
          </div>
          <div class="pathTool pull-right winActive"
               style="border-left: rgba(128, 128, 128, 0.5) 1px solid;"
               @click="refreshPath">
            <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>
          </div>
          <div class="pathTool pull-right winActive">
            <span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>
          </div>
        </div>
        <div class="pathSearch">
          <el-input size="small" placeholder="搜索文件" clearable
                    v-model="fileSearchText"
                    prefix-icon="el-icon-search">
          </el-input>
        </div>
      </div>

      <el-col :span="18" class="explorer-content">
        <div style="height: 100%" @click="selDBFile(null)" v-loading="loading">
          <div class="diskList" v-if="fileExplorerModel==='diskInfo'">
            <DBList></DBList>
          </div>
          <fileListPreview v-if="fileExplorerModel==='search'"></fileListPreview>
        </div>
      </el-col>
      <el-col :span="6" style="padding: 15px">
        <filePreview v-if="currentFile"></filePreview>
        <computerPreview v-show="!selDBName && !currentPath"></computerPreview>
        <DBPreview v-if="selDBName"></DBPreview>
      </el-col>
    </el-row>

    <AttrSetting></AttrSetting>
    <runInfo></runInfo>
    <Group></Group>
    <AddDB></AddDB>
    <ExportDB></ExportDB>
  </el-col>
</template>

<script>
import ManaAPI from './lib/ManaAPI.js';
import FilePreview from './preview/filePreview.vue';
import ExportDB from './com/exportDB.vue';
import AddDB from './com/addDB.vue';
import Group from './com/Group.vue';
import RunInfo from './runInfo/runInfo.vue';
import DBPreview from './preview/DBPreview.vue';
import FileListPreview from './preview/fileListPreview.vue';
import AttrSetting from './com/AttrSetting.vue';
import ComputerPreview from './preview/computerPreview.vue';
import DBList from './com/DBList.vue';

export default {
  name: 'virtualDisk',
  components: {DBList, ComputerPreview, AttrSetting, FileListPreview, DBPreview, RunInfo, Group, AddDB, ExportDB, FilePreview},
  data: function () {
    return {
      loading: true,
      fileSearchText: '',
    };
  },
  computed: {
    fileExplorerModel() {
      return this.$store.state.fileExplorerModel;
    },
    selDBName() {
      return this.$store.state.selDBName;
    },
    selFileName() {
      return this.$store.state.selFileName;
    },
    currentDB() {
      return this.$store.state.currentDB;
    },
    currentFile() {
      return this.$store.state.currentFile;
    },
    currentPath() {
      return this.$store.state.currentPath;
    },
    DBList() {
      return this.$store.state.DBList;
    },
    fileList() {
      return this.$store.state.fileList;
    },
    currentPathItem() {
      return this.$store.getters.currentPathItem;
    }
  },
  methods: {
    // 返回虚拟磁盘显示首页
    async comeHome() {
      this.$store.commit('setFileExplorerModel', 'diskInfo');
      this.$store.commit('setSelDBName', null);
      this.$store.commit('setCurrentDB', null);
      this.$store.commit('setCurrentPath', null);
      this.$store.commit('setCurrentFile', null);
    },
    // 选择数据库
    async selDBFile(DBName) {
      this.$store.commit('setSelDBName', DBName);
    },
    // 进入文件夹
    async inFolder(filePath) {
      let fileList = await ManaAPI.getFileListByPath(this.currentDB, filePath);
      this.$store.commit('setCurrentPath', '\\' + filePath);
      this.$store.commit('setCurrentFile', null);
      this.$store.commit('setFileList', fileList);
    },
    // 刷新当前路径
    async refreshPath() {
      let DBList = await ManaAPI.getDBList();
      this.$store.commit('setDBList', DBList);
    }
  },
  async mounted() {
    let that = this;
    await that.refreshPath();
    this.loading = false;
  },
  watch: {
    fileSearchText(val) {
      if (val) {
        this.$store.commit('setFileExplorerModel', 'search');
        this.$store.commit('setCurrentPath', 'search');
        let fileList = ManaAPI.getFileBySearch(this.selDBName, val);
        this.$store.commit('setFileList', fileList);
      } else {
        this.comeHome();
      }
    }
  }
};
</script>

<style scoped lang="less">
@import "../../../assets/fileMana/main.less";
@import "./virtualDisk.less";
</style>
