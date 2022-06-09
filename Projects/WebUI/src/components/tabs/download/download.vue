<template>
  <div>
    <div id="tableDiv">
      <table class="table table-bordered table-striped">
        <thead>
        <tr>
          <th>名称</th>
          <th>描述</th>
          <th style="width: 100px">大小</th>
          <th style="width: 100px">日期</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in dataList">
          <td>
            <code>{{ item.name }}</code>
          </td>
          <td style="text-align: left">{{ item.describe }}</td>
          <td style="width: 100px">
            <el-tag type="success" size="small" v-if="item.size">{{ item.size }}</el-tag>
          </td>
          <td style="width: 100px">{{ item.date }}</td>
          <td style="width: 100px">
            <button type="button" class="btn btn-default btn-sm" v-if="item.url" @click="copyFileUrl(item.url)">复制链接
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div style="border: #ebeef5 solid 1px;padding: 5px;border-radius: 0 0 10px 10px;">
      <p>部署方式：</p>
      <p style="text-indent:2em;color: #66c03b">
        复制下载链接，通过浏览器下载资源包。下载完成后，将 xxx.sqlite3 格式的资源包放置到项目的
        <code @click="openSystemPath">\Server-win-x64\temp\fileDB</code>
        文件夹内即可， 更多资源链接可联系作者获取。
      </p>
      <hr style="margin: 0">
      <p>免责声明：</p>
      <p style="text-indent:2em;color: #e4a13d">
        目前国内各大地图厂商都提供了免费（免费Key数据量以及访问频率都受限制）或者收费的地图数据访问授权。本软件提供影像等资源的下载功能，但仅供学习和研究使用，
        数据版权归图商所有，请您合理使用；如需商用，请自行获取版权方授权，对于使用不当造成的法律后果，软件作者不承担任何连带责任。
      </p>
    </div>
  </div>
</template>

<script>
import toClipboard from '../virtualDisk/lib/toClipboard.js';
import ManaAPI from '../virtualDisk/lib/ManaAPI.js';

export default {
  name: 'download',
  data: function () {
    return {
      dataList: []
    };
  },
  computed: {
    serverInfo: function () {
      return this.$store.state.serverInfo;
    }
  },
  methods: {
    async copyFileUrl(url) {
      toClipboard(url, () => {
        this.$message({
          message: 'URL 复制到粘贴板成功',
          type: 'success'
        });
      });
    },
    openSystemPath() {
      ManaAPI.openCatalogue(this.serverInfo.appBasePath + 'temp\\fileDB\\');
    }
  },
  async mounted() {
    let {data} = await axios.get('https://sqlite-file-mana.oss-cn-hangzhou.aliyuncs.com/dateList.json');
    this.dataList = data;
  }
};
</script>

<style lang="less" scoped>
#tableDiv {
  height: 320px;
  overflow: auto;
}

table {
  margin: 0 !important;

  th {
    text-align: center;
  }

  td {
    text-align: center;
    vertical-align: middle !important;
    padding: 6px !important;
  }

}
</style>
