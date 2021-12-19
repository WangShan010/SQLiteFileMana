import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'mainBlank',
            component: () => import('../components/mainBlank.vue')
        },
        {
            // 404页面
            path: '*',
            component: () => import('../views/404/pageMissing.vue')
        }
    ]
});

