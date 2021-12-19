<template>
  <div id="mainAPP">
    <el-tabs class="tabs" v-model="activeName" type="border-card">
      <el-tab-pane class="allHeight" label="虚拟磁盘" name="virtualDisk">
        <virtual-disk></virtual-disk>
      </el-tab-pane>
      <el-tab-pane class="allHeight" label="服务管理" name="microservice">
        <microservice></microservice>
      </el-tab-pane>
      <el-tab-pane class="allHeight" label="三维场景" name="vgeEarth">
        <vge-earth></vge-earth>
      </el-tab-pane>
      <el-tab-pane class="allHeight" label="系统设置" name="settings">
        <settings></settings>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import VirtualDisk from './tabs/virtualDisk/virtualDisk.vue';
import VgeEarth from './tabs/vgeEarth/vgeEarth.vue';
import Settings from './tabs/settings/settings.vue';
import Microservice from '@/components/tabs/Microservice/Microservice.vue';

export default {
  name: 'mainBlank',
  components: {Microservice, Settings, VgeEarth, VirtualDisk},
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
  },
  mounted: async function () {
    let that = this;

    // that.DBList = await API.getDBList();
    // console.log(that.DBList);

    // initServerControl();
    // initLoadData();
    // updateOnlineStatus();
  }
};
</script>

<style scoped>
#mainAPP {
  padding: 5px;
  height: 100%;
}

.tabs {
  height: 100%;
  overflow: hidden;
}

.allHeight {
  height: 100%;
  margin: 2px;
}


#mainAPP >>> .el-tabs__content {
  padding: 0;
  overflow: hidden;
  height: calc(100% - 41px);
}

#cesiumContainer {
  height: 100%;
  width: 100%;
}

/* element tab控件 内容页 */
/*.el-tabs--border-card > .el-tabs__content {*/
/*  padding: 0;*/
/*}*/

</style>
