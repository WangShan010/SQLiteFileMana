<template>
  <div class="modal fade" id="AttrSetting" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">资源库-配置属性</h4>
        </div>
        <div class="modal-body">
          <table class="table table-bordered">
            <thead>
            <tr>
              <th width="140px">属性</th>
              <th>值</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>类型</td>
              <td>
                <el-select v-model="DBProps.mataData.DBType" size="small" @change="changeMataData">
                  <el-option
                      v-for="item in DBTypeList"
                      v-if="item.name"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name">
                  </el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>分组</td>
              <td>
                <el-select v-model="DBProps.mataData.DBGroup" size="small" @change="changeMataData">
                  <el-option
                      v-for="item in groupList"
                      v-if="item.name"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name">
                  </el-option>
                </el-select>
              </td>
            </tr>
            </tbody>
          </table>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {DBTypeList} from '../lib/DBTypeList.js';
import ManaAPI from '../lib/ManaAPI.js';

export default {
  name: 'AttrSetting',
  data: function () {
    return {
      DBProps: {
        DBName: '',
        targetDirectory: '',
        mataData: {
          DBType: '',
          DBGroup: ''
        }
      },
      editing: false,
      DBTypeList: DBTypeList
    };
  },
  computed: {
    selDBName: function () {
      return this.$store.state.selDBName;
    },
    DBList: function () {
      return this.$store.state.DBList;
    },
    groupList() {
      return this.$store.state.groupList;
    },
  },
  methods: {
    async changeMataData() {
      let msg = await ManaAPI.setMataData(this.selDBName, this.DBProps.mataData);
      let DBList = await ManaAPI.getDBList();
      this.$store.commit('setDBList', DBList);
      this.$message({type: 'success', message: msg});
    }
  },
  watch: {
    selDBName(newVal) {
      if (newVal) {
        this.DBProps = this.DBList.find(item => item.fileName === newVal);
      }
    }
  }
};
</script>

<style lang="less" scoped>
table {
  th, td {
    text-align: center;
  }
}
</style>
