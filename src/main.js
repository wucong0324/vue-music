// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import '@/common/style/index.scss'

fastclick.attach(document.body);
Vue.use(VueLazyLoad, {
    loading: require('@/common/images/default.png')
});

Vue.config.productionTip = false;

/* eslint-disable no-new */

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
