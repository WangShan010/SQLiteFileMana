import Vue from 'vue';
import App from './App';
import router from './router';

import './plugin/index.js';

import './assets/global/css/style.css'; // 主 CSS
import './assets/global/js/index.js';  // 禁用复制

import store from './store/index.js'; // 导入 Vuex store
import clientWebSocketTool from './assets/global/js/clientWebSocketTool.js';

Vue.config.productionTip = false; // 阻止显示显示生产模式的 warning 消息

new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    created() {
        window.store = this.$store;
        window.clientWebSocketTool = clientWebSocketTool;
        clientWebSocketTool.connect();
    },
    destroyed() {
        clientWebSocketTool.close();
    },
    template: '<App/>'
});
