<template>
  <el-row class="foot">
    <el-col :span="4">
      {{ fileListLength }}&nbsp;&nbsp;个项目
    </el-col>
    <el-col :span="13" class="progress" v-if="runProgress">
      <div class="progress-bar progress-bar-success progress-bar-striped active"
           :style="{width: runProgress+'%'}"></div>
    </el-col>
    <el-col :span="7" v-if="runProgress">
      <div style="text-align: center">
        已耗时：{{ passTime }} 秒，预计总耗时：{{ sumTime }} 秒
      </div>
    </el-col>
  </el-row>
</template>

<script>
import ManaAPI from '../lib/ManaAPI.js';

export default {
  name: 'runInfo',
  data() {
    return {
      passTime: 0,
      sumTime: 0
    };
  },
  computed: {
    runProgress: function () {
      return this.$store.state.runProgress;
    },
    fileListLength(state) {
      return this.$store.getters.fileListLength;
    }
  },
  async mounted() {
    let that = this;
    that.$store.commit('setIsRunning', false);
    window.clientWebSocketTool.addListen('runProgress', function (json) {
      that.$store.commit('setIsRunning', true);
      that.$store.commit('setRunProgress', json.completed / json.total * 100);
      console.log(JSON.stringify(json));
      that.passTime = json.passTime;
      that.sumTime = Math.ceil(json.passTime / (json.completed / json.total));
      if (json.completed === json.total) {
        that.$store.commit('setIsRunning', false);
        that.$store.commit('setRunProgress', 0);
        ManaAPI.getDBList().then((DBList) => {
          window.store.commit('setDBList', DBList);
        });
      }
    });
  }
};
</script>

<style lang="less" scoped>
.foot {
  position: fixed;
  width: 100%;
  bottom: 2px;

  height: 25px;
  padding: 3px 0 3px 11px;
  font-size: 12px;


  .progress {
    display: inline-block;
    height: 8px;
    margin: 6px 0 0 0;
  }
}
</style>
