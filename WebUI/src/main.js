import Vue from "vue";
import App from "./App";
import router from "./router";

// 制定库
import components from "@/plugin/index.js"; // 其他常用库
import YaoDo from "../core/Lib/YaoDo/YaoDo.min.js";
import VGEEarth from "../core/Lib/VGEEarth/VGEEarth.min.js";// 加载 核心库

import "@/assets/global/css/style.css"; // 主 CSS
import "@/assets/global/js/index.js";  // 禁用复制

// 加载第 Vue 插件库
import Vuex from "vuex";  // 载入 VueX
import Element from "@/plugin/Element.js"; // 加载 Element

Vue.use(Vuex);
Vue.use(Element);


import store from "@/store/index.js"; // 导入 Vuex store
import clientWebSocketTool from "@/assets/global/js/clientWebSocketTool.js";

window.clientWebSocketTool = clientWebSocketTool;


Vue.config.productionTip = false; // 阻止显示显示生产模式的 warning 消息

new Vue({
    el: "#app",
    router,
    components: {App},
    created() {
        clientWebSocketTool.connect();
    },
    destroyed() {
        clientWebSocketTool.close();
    },
    template: "<App/>"
});
