<template>
  <!-- 导出文件 -->
  <div class="modal fade" id="exportDB" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">导出文件</h4>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>资源库</label>
            <input class="form-control" :value="selDBName" disabled>
          </div>
          <div class="form-group">
            <label>保存位置</label>
            <div class="input-group">
              <input type="text" class="form-control input-sm" disabled v-model="targetDirectory">
              <span class="input-group-btn">
                  <button class="btn btn-default btn-sm" type="button" @click="changeSavePath">更改</button>
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
</template>

<script>
import ManaAPI from '../lib/ManaAPI.js';

export default {
  name: 'exportDB',
  data: function () {
    return {
      // 导出资源库的参数
      targetDirectory: ''
    };
  },
  computed: {
    DBList() {
      return this.$store.state.DBList;
    },
    selDBName() {
      return this.$store.state.selDBName;
    },
  },
  methods: {
    // 导出资源库
    async exportDB() {
      let that = this;
      if (this.targetDirectory){
        that.runTask = true;
        await ManaAPI.exportDB(this.targetDirectory, this.selDBName);
        that.targetDirectory = '';
      }
    },
    async changeSavePath() {
      let {path} = await ManaAPI.choosePath();
      this.targetDirectory = path || this.targetDirectory;
    }
  }
};
</script>

<style scoped>

</style>
