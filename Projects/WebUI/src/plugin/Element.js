// 默认加载 Element
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

const install = function (Vue, opts = {}) {
    if (install.installed) return;
    install.installed = true;
    Vue.use(Element);
};


export default {install};


