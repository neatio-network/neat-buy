import Vue from 'vue'
import Router from 'vue-router'
const Layout = resolve => require(['@/components/layouts/Layout'], resolve);
const neatBuy = resolve => require(['@/components/pages/neatBuy'], resolve)


Vue.use(Router)
const router = new Router({
    mode: 'history',
    routes: [{
        path: '/',
        component: Layout,
        children: [{
            path: '',
            name: 'neatBuy',
            component: neatBuy,
            meta: []
        },

        ]
    }]
})

export default router
