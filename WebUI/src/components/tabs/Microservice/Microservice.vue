<template>
  <div class="content">
    <table class="table table-bordered table-striped table-hover" style="margin: 0">
      <thead>
      <tr>
        <th>库名</th>
        <th>路径</th>
        <th>大小</th>
        <th>状态</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in DBList" :key="item.id">
        <td>
          <el-radio v-model="DBSelect" :label="item.id">{{ item.fileName }}</el-radio>
        </td>
        <td>{{ item.path }}</td>
        <td>{{ item.sizeFormat }}</td>
        <th>
          <span class="glyphicon glyphicon-cloud-upload text-success" aria-hidden="true"></span>
          <span class="text-success">服务运行中...</span>
        </th>
        <td>
          <button class="btn btn-default btn-xs btn-success">发布服务</button>
          <button class="btn btn-default btn-xs btn-danger">停用服务</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import API from '@/assets/fileMana/js/API';

export default {
  name: 'Microservice',
  data: function () {
    return {
      DBList: [],
      DBSelect: ''
    };
  },
  methods: {
    async refreshPath() {
      this.DBList = await API.getDBList();
    }
  },
  mounted: async function () {
    await this.refreshPath();
  }
};
</script>

<style scoped>
.content {
  max-height: 200px;
  overflow: auto;
  padding: 15px;
}
</style>
