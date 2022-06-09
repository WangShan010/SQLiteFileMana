<template>
  <transition name="fade">
    <div>
      <div style="text-align: center;padding-bottom: 10px">
        <div style="padding: 5px 0">
          <span style="font-size: 20px;color: #0077c7;"> {{ selDBName }}</span>
        </div>
        <img src="../../../../assets/fileMana/DBType/disk.png" height="110px" alt="">
      </div>
      <div style="height:170px;">
        <table class="disk-info-table">
          <tr>
            <td style="width: 80px">占用空间：</td>
            <td>{{ DBInfo.sizeFormat }}</td>
          </tr>
          <tr>
            <td>文件总数：</td>
            <td>{{ DBInfo.mataData.fileCount }} 项</td>
          </tr>
          <tr>
            <td>文件类型：</td>
            <td>{{ DBInfo.mataData.DBType }}</td>
          </tr>
          <tr>
            <td>文件分组：</td>
            <td>{{ DBInfo.mataData.DBGroup }}</td>
          </tr>
          <tr>
            <td>文件地址：</td>
            <td @click="toPath(DBInfo.filePath)"><a>{{ DBInfo.filePath }}</a></td>
          </tr>
        </table>
      </div>

      <hr>
      <div class="ctr-btn">
        <button class="btn btn-danger btn-sm" @click="deleteDB" :disabled="isRunning">删除</button>
        <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#AttrSetting" :disabled="isRunning">属性</button>
        <button class="btn btn-success btn-sm" data-toggle="modal" data-target="#exportDB" :disabled="isRunning">导出</button>
      </div>
    </div>
  </transition>
</template>

<script>
import ManaAPI from '../lib/ManaAPI.js';

export default {
  name: 'DBPreview',
  computed: {
    isRunning: function () {
      return this.$store.state.isRunning;
    },
    DBList() {
      return this.$store.state.DBList;
    },
    selDBName() {
      return this.$store.state.selDBName;
    },
    DBInfo() {
      return this.DBList.find(item => item.fileName === this.selDBName) || {};
    }
  },
  methods: {
    async deleteDB() {
      this.$confirm(`此操作将永久删除该资源库:【${this.selDBName}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let result = await ManaAPI.deleteDB(this.selDBName);
            if (result) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              let list = await ManaAPI.getDBList();
              this.$store.commit('setDBList', list);
              this.$store.commit('setCurrentDB', null);
              this.$store.commit('setSelDBName', null);
            } else {
              this.$message({
                message: '删除失败，该资源库正在被其他程序使用',
                type: 'warning'
              });
            }
          })
          .catch(() => {
            this.$message({type: 'info', message: '已取消删除'});
          });
    },
    exportDB() {
      ManaAPI.exportDB(this.selDBName);
    },
    toPath(url) {
      this.$confirm('打开资源库的路径, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await ManaAPI.openCatalogue(url);
      }).catch(() => {
      });
    }
  },
  async mounted() {
    let DBList = await ManaAPI.getDBList();
    this.$store.commit('setDBList', DBList);
  }
};
</script>

<style lang="less" scoped>
.ctr-btn {
  text-align: center;
}

.disk-info-table {
  border: #6e6e95;

  td {
    text-align: center;
    padding: 5px 0;
    font-size: 12.5px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    word-break: break-all;
    color: #4b556e;

    a {
      font-size: 12px;
    }
  }
}
</style>
