<template>
  <div class="content">
    <div style="padding: 30px;text-align: center">
      <el-button type="warning" onclick="location.reload()">重启程序</el-button>
    </div>
    <div>
      <el-descriptions title="关于其他：" direction="vertical" border :column="3">
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            作者
          </template>
          WangShan010
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            QQ
          </template>
          2394837320
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            城市
          </template>
          北京市
        </el-descriptions-item>
        <el-descriptions-item label="版本号">
          <el-tag size="small">v1.2（正式版）</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="项目地址">
          <span @click="copyFileUrl">{{ projectUrl }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="编译日期">
          <span>2022年06月08日</span>
        </el-descriptions-item>
      </el-descriptions>
      <div style="border: #ebeef5 solid 1px;padding: 5px;border-radius: 0 0 10px 10px;color: #e4a13d">
        <p>免责声明：</p>
        <p style="text-indent:2em">
          本软件源码已公开，提供资源数据在本机、内网发布的功能，如需使用，数据安全由使用者自行负责，软件作者不承担任何责任。
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import toClipboard from '../virtualDisk/lib/toClipboard.js';


export default {
  name: 'settings',
  data: function () {
    return {
      projectUrl: 'https://gitee.com/WangShan010/SQLiteFileMana.git'
    };
  },
  methods: {
    async copyFileUrl() {
      toClipboard(this.projectUrl, () => {
        this.$message({
          message: 'URL 复制到粘贴板成功',
          type: 'success'
        });
      });
    }
  }
};
</script>

<style scoped>
.content {
  padding: 15px;
}
</style>
