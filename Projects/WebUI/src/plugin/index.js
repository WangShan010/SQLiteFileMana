/****************************************************************************
 名称：常用的第三方工具库，为了进行页面懒加载，默认是
 作者：冯功耀
 最后修改日期：2022-03-24
 ****************************************************************************/

import Vue from 'vue';
import Vuex from 'vuex';
import Element from './Element.js';
import installDrag from '../assets/global/directives/drag.js'; //拖拽


Vue.use(Vuex);
Vue.use(Element);
installDrag(Vue);
