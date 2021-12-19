<template>
  <div id="cesiumContainer"></div>
</template>

<script>
export default {
  name: "vgeEarth",
  methods:{
    initMap() {
      // 初始化地球
      let {viewer3D: viewer} = VGEEarth.Viewer.createViewer("cesiumContainer");
      VGEEarth.Viewer.createNavigation(viewer);
      window.viewer = viewer;
    },
  },
  mounted:async function() {

    this.initMap();
  }
};
</script>

<style scoped>

</style>
