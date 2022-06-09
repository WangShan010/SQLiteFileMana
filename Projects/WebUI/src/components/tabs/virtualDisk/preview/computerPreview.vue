<template>
  <transition name="fade">
    <div class="comLeft">
      <img src="../../../../assets/fileMana/virtualDisk/img/Windows.png" width="205px">
      <div style="overflow: auto;padding: 10px;text-align: center">
        <button class="btn btn-default btn-sm" :disabled="isRunning"
                data-toggle="modal" data-target="#groupMana">分组
        </button>
        <button class="btn btn-default btn-sm" :disabled="isRunning"
                data-toggle="modal" data-target="#addDB">建库
        </button>
      </div>
      <div v-if="serverInfo" class="serverInfo">
        <div>机器名称：{{ serverInfo.机器名称 }}</div>
        <div>系统架构：{{ serverInfo.系统架构 }}</div>
        <div>操作系统：{{ serverInfo.操作系统 }}</div>
        <div>内存容量：{{ serverInfo.内存容量 }}</div>
        <div>&nbsp;处&nbsp;理&nbsp;器&nbsp;：{{ serverInfo.处理器 }}</div>
      </div>
    </div>
  </transition>
</template>

<script>
import ManaAPI from '../lib/ManaAPI.js';

export default {
  name: 'computerPreview',
  data: function () {
    return {
      pathTree: [{
        children: 'children',
        label: 'label'
      }]
    };
  },
  computed: {
    serverInfo: function () {
      return this.$store.state.serverInfo;
    },
    isRunning: function () {
      return this.$store.state.isRunning;
    }
  },
  async mounted() {
    let serverInfo = await ManaAPI.getServerInfo();
    this.$store.commit('setServerInfo', serverInfo);
  }
};
</script>

<style lang="less" scoped>
.comLeft {
  display: inline-block;
  width: 100%;
  min-width: 175px;
  height: calc(100% - 5px);
  overflow: auto;
  padding-right: 2px;
  padding-top: 10px;
}

.serverInfo {
  word-break: break-all;
  margin: 30px 0;

  div {
    margin: 5px 0;
  }
}
</style>
