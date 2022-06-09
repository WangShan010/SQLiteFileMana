<template>
  <transition name="fade">
    <div>
      <div class="dirPanel" v-if="fileType==='directory'">
        <div>名称：{{ currentFile.file_name }}</div>
        <div>子项：{{childFileCount}} 个</div>
        <div>大小：{{ childFileTotalSize }}</div>

        <div class="ctrl">
          <button type="button" class="btn btn-sm btn-success" @click="appendFile" :disabled="isRunning">追加文件夹</button>
          <button type="button" class="btn btn-sm btn-danger" @click="deleteDirectory" :disabled="isRunning">删除文件夹</button>
        </div>
      </div>
      <div class="filePanel" v-if="fileType==='file' && fileUrl">
        <h2>预览</h2>
        <a href="#" class="thumbnail" style="position: relative;height: 215px">
          <iframe :src="fileUrl" content="initial-scale=0.5"></iframe>
        </a>
        <div class="fileInfo" @click="copyFileUrl">
          <p> 链接：<span>{{ fileUrl }}</span></p>
        </div>

        <div style="text-align: center">
          <button type="button" class="btn btn-sm btn-danger" @click="deleteFile" :disabled="isRunning">删除文件</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import toClipboard from '../lib/toClipboard.js';
import ManaAPI from '../lib/ManaAPI.js';

export default {
  name: 'filePreview',
  data() {
    return {
      fileType: 'file',
      fileUrl: '',

      childFileCount: 0,
      childFileTotalSize: 0
    };
  },
  computed: {
    currentDB() {
      return this.$store.state.currentDB;
    },
    currentFile() {
      return this.$store.state.currentFile;
    },
    currentPath() {
      return this.$store.state.currentPath;
    },
    isRunning() {
      return this.$store.state.isRunning;
    }
  },
  methods: {
    async previewImgByBuffer(fileBuffer) {
      this.previewImg = 'data:image/png;base64,' + btoa(new Uint8Array(fileBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    },
    async copyFileUrl() {
      toClipboard(this.fileUrl, () => {
        this.$message({
          message: 'URL 复制到粘贴板成功',
          type: 'success'
        });
      });
    },
    async appendFile() {
      let {path} = await ManaAPI.choosePath();
      let currentDirectory = this.currentPath.replace(this.currentDB, '') + path.split('\\').pop();
      let msg = await ManaAPI.appendFile(this.currentDB, path, currentDirectory);
      let fileList = await ManaAPI.getFileListByPath(this.currentDB, this.currentPath.replace(this.currentDB, ''));
      this.$store.commit('setFileList', fileList);

      // console.log(msg);
    },
    async deleteFile() {
      let that = this;
      let fileFullPath = that.currentFile.file_path + that.currentFile.file_name;
      that.$confirm(`删除文件：【${fileFullPath}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let {changes} = await ManaAPI.deleteByFullPath(that.currentDB, fileFullPath);
        let fileList = await ManaAPI.getFileListByPath(that.currentDB, that.currentFile.file_path);
        that.$store.commit('setCurrentFile', null);
        that.$store.commit('setFileList', fileList);
        that.$message({
          message: changes + ' 个文件被删除',
          type: 'success'
        });
      }).catch(() => {
      });
    },
    async deleteDirectory() {
      let that = this;
      let fileFullPath = that.currentFile.file_path;
      that.$confirm(`删除文件：【${fileFullPath}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        that.$store.commit('setIsRunning', true);
        let {changes} = await ManaAPI.deleteByDir(that.currentDB, fileFullPath);
        let fileList = await ManaAPI.getFileListByPath(that.currentDB, that.currentPath.replace(that.currentDB, '').replace('\\\\', '\\'));
        that.$store.commit('setCurrentFile', null);
        that.$store.commit('setFileList', fileList);
        that.$store.commit('setIsRunning', false);
        that.$message({
          message: changes + ' 个文件被删除',
          type: 'success'
        });
      }).catch(() => {
      });
    }
  },
  watch: {
    currentFile: {
      handler: async function (e) {
        if (!e) {
          this.fileType = null;
          this.fileUrl = null;
        } else if (e.ext === 'directory') {
          this.fileType = 'directory';
          let {childFileCount, childFileTotalSize} = await ManaAPI.getDirInfo(this.currentDB, e.file_path);
          this.childFileCount = childFileCount;
          this.childFileTotalSize = childFileTotalSize;
        } else {
          this.fileType = 'file';
          if (e.file_md5) {
            if (e.file_size <= 1024 * 1024 * 20) {
              this.fileUrl = `http://localhost:${window.clientServerPort}/DBService/${this.currentDB}${(e.file_path + e.file_name).replaceAll('\\', '/')}`;
            } else {
              this.$message({
                message: '文件过大，无法预览',
                type: 'warning'
              });
            }
          }
        }

      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
.dirPanel {

  .ctrl {
    margin: 20px 0;
    text-align: center;
  }
}

.filePanel {
  .fileInfo {
    background: rgba(117, 157, 192, 0.42);
    border-radius: 5px;
    word-break: break-all;
  }

  .fileInfo p {
    padding: 5px;
  }

  iframe {
    position: absolute;
    height: 260px;
    width: 260px;
    border: none;
    overflow: auto;
    transform-origin: left top;
    transform: scale(0.8);
  }
}
</style>
