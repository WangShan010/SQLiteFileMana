<template>
  <div class="content">
    <div>
      数据库基础路径：
      <input type="text" class="form-control input-sm" style="display: inline-block;width: 300px">
      <input class="btn btn-default btn-sm" type="button" @click="selectSystemPath" value="更改">
      <input class="btn btn-default btn-sm" type="button" value="打开文件夹">
    </div>
    <el-button onclick="location.reload()">重启程序</el-button>
  </div>
</template>

<script>
export default {
  name: 'settings',
  methods: {
    selectSystemPath() {
    }
  }
};
</script>

<style scoped>
.content {
  padding: 15px;
}
</style>
