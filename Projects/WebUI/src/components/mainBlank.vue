<template>
  <div id="mainAPP">
    <el-tabs class="tabs" v-model="activeName" type="border-card">
      <el-tab-pane class="allHeight" name="virtualDisk" :lazy="true">
        <span slot="label"><i class="el-icon-receiving"></i>虚拟磁盘</span>
        <virtualDisk></virtualDisk>
      </el-tab-pane>
      <el-tab-pane class="allHeight" name="ResourceDownload" :lazy="true">
        <span slot="label"><i class="el-icon-download"></i>资源下载</span>
        <download></download>
      </el-tab-pane>
      <el-tab-pane class="allHeight" name="vgeEarth" :lazy="true">
        <span slot="label"><i class="el-icon-view"></i>三维场景</span>
        <vge-earth></vge-earth>
      </el-tab-pane>
      <el-tab-pane class="allHeight" name="settings" :lazy="true">
        <span slot="label"><i class="el-icon-setting"></i>系统设置</span>
        <settings></settings>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import VirtualDisk from './tabs/virtualDisk/virtualDisk.vue';
import VgeEarth from './tabs/earth/vgeEarth.vue';
import Settings from './tabs/settings/settings.vue';
import Download from './tabs/download/download.vue';

export default {
  name: 'mainBlank',
  components: {Download, Settings, VgeEarth, VirtualDisk},
  data: function () {
    return {
      activeName: 'virtualDisk',
      webServerStatus: ''
    };
  },
  methods: {
    listenOnline() {
      function updateOnlineStatus() {
        let c = document.getElementById('onLineStatusContent');
        c.innerHTML = navigator.onLine ? '在线' : '离线';
      }

      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
    },
    getVersion() {
    },

    reLoadAll() {
      location.reload();
    }
  }
};
</script>

<style scoped lang="less">
#mainAPP {
  padding: 5px;
  height: 100%;
}

.tabs {
  height: 100%;
  overflow: hidden;

  i {
    margin: 0 3px;
  }
  span{
    font-size: 15px;
  }
}

.allHeight {
  height: 100%;
  margin: 2px;
}

#mainAPP {
  /deep/ .el-tabs__content {
    padding: 0;
    overflow: hidden;
    height: calc(100% - 41px);
  }
}
</style>
