<template>
  <!-- 新建资源库 -->
  <div class="modal fade" id="addDB" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">新建资源库</h4>
        </div>
        <div class="modal-body">
          <el-row>
            <el-col :span="12">
              <div class="form-group">
                <label>名称：</label>
                <el-input placeholder="请输入资源库名称"
                          v-model="createdDBProps.DBName"
                          size="small"
                          style="width: 215px"
                ></el-input>
              </div>
              <div class="form-group">
                <label>分组：</label>
                <el-select v-model="createdDBProps.mataData.DBGroup" size="small">
                  <el-option
                      v-for="item in DBGroupList"
                      :key="item"
                      :label="item"
                      :value="item">
                  </el-option>
                </el-select>
              </div>
              <div class="form-group">
                <label>类型：</label>
                <el-select v-model="createdDBProps.mataData.DBType" placeholder="请选择" size="small">
                  <el-option
                      v-for="item in DBTypeList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="12" style="text-align: center;vertical-align: bottom;display:table-cell;line-height: 130px">
              <img :src="DBImg" style="border-radius: 10px;max-width: 200px;max-height: 120px;">
            </el-col>
          </el-row>

          <div class="form-group" style="margin: 30px 0">
            <label>详情：</label>
            <span>统计文件数【{{ fileCount }}】项</span>
          </div>

          <div class="input-group">
            <span class="input-group-addon">映射目录</span>
            <input type="text" class="form-control input-sm" disabled v-model="createdDBProps.targetDirectory">
            <span class="input-group-btn">
                  <button class="btn btn-default btn-sm" type="button" @click="changeCreatePath">更改</button>
                </span>
          </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-warning" @click="reSet">重置</button>
          <button type="button" class="btn btn-primary" @click="createDB">新增</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {DBTypeList} from '../lib/DBTypeList.js';
import ManaAPI from '../lib/ManaAPI.js';

export default {
  name: 'addDB',
  data: function () {
    return {
      DBGroupList: [
        '通用资源'
      ],
      fileCount: 0,
      DBTypeList: DBTypeList,

      // 创建资源库的参数
      createdDBProps: {
        DBName: '',
        targetDirectory: '',
        mataData: {
          DBType: '常规归档',
          DBGroup: '通用资源'
        }
      }
    };
  },
  computed: {
    DBImg() {
      let DBType = this.DBTypeList.find(item => item.name === this.createdDBProps.mataData.DBType);
      DBType = this.DBTypeList[0];
      return DBType.img;
    }
  },
  methods: {
    // 创建资源库
    async createDB() {
      let that = this;
      let DBName = this.createdDBProps.DBName.replace(/[\*"/:?\\|<>]/im, '');
      if (!DBName || !that.createdDBProps.targetDirectory) {
        that.$message({
          message: '建库失败，无效的：【资源库名称、映射目录】',
          type: 'warning'
        });
        return;
      } else {
        $('#addDB').modal('hide');
        that.$message({
          message: '开始创建资源库...',
          type: 'success'
        });
      }
      that.$store.commit('setIsRunning', true);

      let {msg} = await ManaAPI.createDB(this.createdDBProps.targetDirectory, DBName, this.createdDBProps.mataData);
      that.$message({
        message: msg,
        type: 'success'
      });
      that.reSet();
    },

    reSet() {
      this.fileCount = 0;
      this.createdDBProps = {
        DBName: '',
        targetDirectory: '',
        mataData: {
          DBType: '常规归档',
          DBGroup: '通用资源'
        }
      };
    },

    async changeCreatePath() {
      let {path, fileCount} = await ManaAPI.choosePath();
      if (path) {
        this.fileCount = fileCount;
        this.createdDBProps.DBName = path.split('\\').pop();
        this.createdDBProps.targetDirectory = path || this.createdDBProps.targetDirectory;
      }
    }
  }
};
</script>

<style scoped>

</style>
