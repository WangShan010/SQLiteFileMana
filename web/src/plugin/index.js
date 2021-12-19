import axios from 'axios';
import echarts from 'echarts';
import * as turf from '@turf/turf';
import proj4 from 'proj4';



import installDrag from "@/assets/global/directives/drag.js"; //拖拽
window.axios = axios;
window.turf = turf;
window.proj4 = proj4;


const install = function (Vue, opts = {}) {
  if (install.installed) return;
  Vue.prototype.$echarts = window.echarts = echarts;
  installDrag(Vue)
  install.installed = true;
}


export default {
  install
}
