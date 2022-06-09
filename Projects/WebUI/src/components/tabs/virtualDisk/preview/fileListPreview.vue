<template>
  <div class="fileList" @click.stop="chooseFile(null)" v-loading="loading">
    <table @click.stop>
      <tr>
        <th>名称</th>
        <th style="width: 80px">大小</th>
        <th style="width:250px">MD5</th>
      </tr>
      <tr class="winActive" v-for="item in fileList"
          @dblclick="dblclickFileItem(item)"
          :class="{'select':item.file_name===selFileName}"
      >
        <td @click="chooseFile(item)" style="cursor: pointer;">
          <fileType :ext="item.ext"></fileType>
          <span style="color: black">{{ item.file_name }}</span>
        </td>
        <td  style="cursor: no-drop;">
          <div v-if="item.file_size">
            <span v-if="item.file_size<1024">{{ Math.ceil(item.file_size) }}&nbsp;B</span>
            <span v-if="item.file_size>1024 && item.file_size<1024*1024">{{
                Math.ceil(item.file_size / 1024)
              }}&nbsp;KB</span>
            <span v-if="item.file_size>1024*1024 && item.file_size<1024*1024*1024">{{
                Math.ceil(item.file_size / 1024 / 1024)
              }}&nbsp;MB</span>
          </div>
        </td>
        <td style="cursor: no-drop;">{{ item.file_md5 }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import ClientAPI from '../lib/ClientAPI.js';
import ManaAPI from '../lib/ManaAPI.js';
import FileType from '../com/fileType.vue';

export default {
  name: 'fileListPreview',
  data() {
    return {
      loading: false
    };
  },
  components: {FileType},
  computed: {
    currentDB() {
      return this.$store.state.currentDB;
    },
    selFileName() {
      return this.$store.state.selFileName;
    },
    fileList() {
      return this.$store.state.fileList;
    }
  },
  methods: {
    // 单机文件，进行选取
    async chooseFile(fileItem) {
      await new Promise(resolve => setTimeout(resolve, 10));
      this.$store.commit('setSelFileName', fileItem ? fileItem.file_name : null);
      this.$store.commit('setCurrentFile', fileItem || null);
    },

    // 双击选择一个文件项【可能是文件夹，也可能是文件本身】
    async dblclickFileItem(fileItem) {
      if ('file_md5' in fileItem) {
        let d = await ClientAPI.getFileByMd5(this.currentDB, fileItem.file_md5);
      } else if ('file_path' in fileItem) {
        this.loading = true;
        await this.inFolder(fileItem.file_path);
        this.loading = false;
      }
    },

    // 进入文件夹
    async inFolder(filePath) {
      let fileList = await ManaAPI.getFileListByPath(this.currentDB, filePath);
      this.$store.commit('setCurrentPath', filePath);
      this.$store.commit('setCurrentFile', null);
      this.$store.commit('setFileList', fileList);
    }
  }
};
</script>


<style scoped lang="less">
@import "../../../../assets/fileMana/main.less";

.select {
  background-color: #cbe7fe;
  box-shadow: 0 0 0 1px #98d0fe;
  outline: 1px solid #98d0fe;
  border-radius: 2px;
}

.fileList {
  padding-left: 10px;
  margin-right: 5px;
  height: calc(100% - 50px);
  //height: 450px;
  overflow: auto;

  table {
    width: calc(100% - 5px);
    padding: 1px;
    border-collapse: separate;

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
</style>
