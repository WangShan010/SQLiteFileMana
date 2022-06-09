<template>
  <div style="max-height: 410px;overflow-y: auto;">
    <div class="diskGroup" v-for="DBListChunkObj in DBListChunkObjArr" :key="DBListChunkObj.DBGroup"
         v-loading="loading">
      <div class="diskGroup-head" @click="slideToggle(DBListChunkObj.DBGroup)">
        <span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
        <span style="font-size: 15px;color: #1e3287">{{ DBListChunkObj.DBGroup || '未分类'}}（{{
            DBListChunkObj.DBList.length
          }}）</span>
      </div>
      <div class="diskGroup-content" :id="DBListChunkObj.DBGroup">
        <div class="diskItem winActive" v-for="item in DBListChunkObj.DBList" :key="item.id" @click.stop
             :class="selDBName===item.fileName?'winActive-selected':''"
             @click="selDBFile(item.fileName)"
             @dblclick="inDBFile(item.fileName)">
          <el-row>
            <el-col :span="6" class="disk-icon">
              <img :src="getDBTypeByMataData(item.mataData)">
            </el-col>
            <el-col :span="18" class="disk-info">
              <div class="disk-name">{{ item.fileName }}</div>
              <div class="disk-volume">
                <div style="background-color: #26a0da;height: 14px;display: inline-block"
                     :style="{'width':(item.size/DBListChunkObj.size*100)+'%'}"></div>
              </div>
              <div class="disk-text">占用 {{ item.sizeFormat }} 磁盘空间</div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ManaAPI from '../lib/ManaAPI.js';
import {getDBTypeImg} from '../lib/DBTypeList';


export default {
  name: 'DBList',
  data: function () {
    return {
      loading: false
    };
  },
  computed: {
    fileExplorerModel() {
      return this.$store.state.fileExplorerModel;
    },
    DBList() {
      return this.$store.state.DBList;
    },
    DBListChunkObjArr() {
      let map = new Map();
      if (this.DBList) {
        this.DBList.forEach(item => {
          let group = item.mataData.DBGroup;
          if (map.has(group)) {
            map.get(group).push(item);
          } else {
            map.set(group, [item]);
          }
        });
      }
      let DBListChunk = new Array(...map.values());
      // 将通用资源组放在第一个
      DBListChunk = DBListChunk.sort((a, b) => {
        if (a[0].mataData.DBGroup === '通用资源') {
          return -1;
        } else {
          return 1;
        }
      });

      let DBListChunkObjArr = [];
      for (let i = 0; i < DBListChunk.length; i++) {
        let size = 0;
        DBListChunk[i].forEach(db => {
          size += db.size;
        });

        DBListChunkObjArr.push({
          // uuid
          id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          }),
          DBList: DBListChunk[i],
          DBGroup: DBListChunk[i][0].mataData.DBGroup,
          size: size
        });
      }

      return DBListChunkObjArr;
    },
    groupList() {
      return this.$store.state.groupList;
    },
    selDBName() {
      return this.$store.state.selDBName;
    }
  },
  methods: {
    // 选择数据库
    async selDBFile(DBName) {
      this.$store.commit('setSelDBName', DBName);
    },
    async slideToggle(groupName) {
      $('#' + groupName).slideToggle('fast');
    },
    // 进入数据库
    async inDBFile(DBName) {
      this.$store.commit('setFileExplorerModel', 'search');
      this.$store.commit('setSelDBName', null);
      this.$store.commit('setCurrentDB', DBName);
      this.$store.commit('setCurrentPath', '\\');
      this.$store.commit('setFileList', []);

      this.loading = true;
      let fileList = await ManaAPI.getFileListByPath(DBName, '\\');
      this.$store.commit('setFileList', fileList);
      this.loading = false;
    },
    getDBTypeByMataData(mataData) {
      let DBImg;
      if (mataData && mataData.DBType) {
        DBImg = getDBTypeImg(mataData.DBType);
      } else {
        DBImg = getDBTypeImg(null);
      }
      return DBImg;
    }
  }

};
</script>

<style lang="less" scoped>
@import "../../../../assets/fileMana/main.less";

.diskGroup {
  .diskGroup-head {
    height: 28px;
    padding: 3px 3px;
  }

  .diskGroup-head:hover {
    background-color: #e3f1fd;
  }

  .diskGroup-content {
    padding-top: 2px;
    padding-left: 25px;
  }

  .diskItem {
    width: 290px;
    height: 60px;
    font-size: 0;
    border-radius: 1px;
    display: inline-block;
    cursor: pointer;
    margin: 5px;
    border: 1px solid transparent;

    .disk-icon {
      display: inline-block;
      width: 56px;
      padding: 4px;
      height: 100%;
      font-size: 11px;

      img {
        width: 48px;
        height: 48px;
      }
    }

    .disk-info {
      display: inline-block;
      font-size: 11px;
      width: 215px;

      .disk-name {
        padding: 2px 0;
        font-size: 13px;
      }

      .disk-volume {
        border: 1px silver solid;
        background-color: #e5e5e5;
        font-size: 0;
      }

      .disk-text {
        padding: 2px 0;
        font-size: 12px;
        color: #6d6d6d;
      }
    }
  }
}
</style>
