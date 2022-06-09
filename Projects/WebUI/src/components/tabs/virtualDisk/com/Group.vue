<!-- 分组管理 -->

<template>
  <div class="modal fade" id="groupMana" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">分组管理</h4>
        </div>
        <div class="modal-body" style="height: 350px;overflow-y: auto">

          <div class="form-group">
            <div class="input-group" v-for="item in groupList" style="margin: 8px;width: 100%" :key="item.name">
              <input type="text" class="form-control" v-model="item.name" disabled>
              <span class="input-group-addon" style="width: 130px" v-if="item.sum">【{{ item.sum }}】 项资源库</span>
              <span class="input-group-addon" style="width: 130px;color: #3c763d" v-if="item.sum===0">新增临时资源库</span>
            </div>

            <hr>
            <div class="input-group" style="margin: 8px">
              <input type="text" class="form-control" style="color: #3c763d" v-model="addGroupName">
              <span class="input-group-btn">
                  <button class="btn btn-default" type="button" @click="addGroup">
                    <span class="glyphicon glyphicon-plus text-success" aria-hidden="true"></span>
                    添加新分组
                  </button>
              </span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Group',
  data: function () {
    return {
      addGroupName: ''
    };
  },
  computed: {
    DBList() {
      return this.$store.state.DBList;
    },
    groupList() {
      return this.$store.state.groupList;
    }
  },
  methods: {
    addGroup() {
      this.$store.commit('addGroup', this.addGroupName);
      this.addGroupName = '';
    }
  }
};
</script>

<style lang="less" scoped>

</style>
