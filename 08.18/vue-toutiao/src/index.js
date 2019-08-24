/**
 * @file 文件主入口
 * @author jinxing
 */

import Vue from 'vue'
import VueRouter from './vue-fake-router'
import Main from './pages/main.vue'



new Vue({
	el: '#app',
	render: (h) => h(Main)
})