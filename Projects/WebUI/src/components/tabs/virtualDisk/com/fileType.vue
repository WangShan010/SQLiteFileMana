<template>
  <div style="display: inline-block;padding-bottom: 1px">
    <img :src="iconUrl" width="20" alt="">
  </div>
</template>

<script>

let unknownIcon = require('../../../../assets/fileMana/fileType/unknown.png');
let fileTypes = [
  {extName: 'directory', iconUrl: require('../../../../assets/fileMana/fileType/directory.png')},
  {extName: '.cpp', iconUrl: require('../../../../assets/fileMana/fileType/cpp.png')},
  {extName: '.css', iconUrl: require('../../../../assets/fileMana/fileType/css.png')},
  {extName: '.doc', iconUrl: require('../../../../assets/fileMana/fileType/doc.png')},
  {extName: '.docx', iconUrl: require('../../../../assets/fileMana/fileType/docx.png')},
  {extName: '.exe', iconUrl: require('../../../../assets/fileMana/fileType/exe.png')},
  {extName: '.html', iconUrl: require('../../../../assets/fileMana/fileType/html.png')},
  {extName: '.jpeg', iconUrl: require('../../../../assets/fileMana/fileType/jpeg.png')},
  {extName: '.jpg', iconUrl: require('../../../../assets/fileMana/fileType/jpg.png')},
  {extName: '.js', iconUrl: require('../../../../assets/fileMana/fileType/js.png')},
  {extName: '.json', iconUrl: require('../../../../assets/fileMana/fileType/json.png')},
  {extName: '.md', iconUrl: require('../../../../assets/fileMana/fileType/md.png')},
  {extName: '.mp3', iconUrl: require('../../../../assets/fileMana/fileType/mp3.png')},
  {extName: '.mp4', iconUrl: require('../../../../assets/fileMana/fileType/mp4.png')},
  {extName: '.pages', iconUrl: require('../../../../assets/fileMana/fileType/pages.png')},
  {extName: '.pdf', iconUrl: require('../../../../assets/fileMana/fileType/pdf.png')},
  {extName: '.png', iconUrl: require('../../../../assets/fileMana/fileType/png.png')},
  {extName: '.py', iconUrl: require('../../../../assets/fileMana/fileType/py.png')},
  {extName: '.rar', iconUrl: require('../../../../assets/fileMana/fileType/rar.png')},
  {extName: '.txt', iconUrl: require('../../../../assets/fileMana/fileType/txt.png')},
  {extName: '.wav', iconUrl: require('../../../../assets/fileMana/fileType/wav.png')},
  {extName: '.xls', iconUrl: require('../../../../assets/fileMana/fileType/xls.png')},
  {extName: '.xml', iconUrl: require('../../../../assets/fileMana/fileType/xml.png')},
  {extName: '.zip', iconUrl: require('../../../../assets/fileMana/fileType/zip.png')},
  {extName: '.file', iconUrl: require('../../../../assets/fileMana/fileType/file.png')}
];

export default {
  name: 'fileType',
  props: {
    ext: {
      type: String,
      default: ''
    }
  },
  computed: {
    extType: function () {
      return this.ext.toLowerCase();
    },
    iconUrl: function () {
      let fileType = fileTypes.find(item => item.extName === this.extType);
      return fileType ? fileType.iconUrl : unknownIcon;
    }
  }
};
</script>

<style scoped>

</style>
