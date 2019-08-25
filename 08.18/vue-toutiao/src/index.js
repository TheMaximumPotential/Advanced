/**
 * @file 文件主入口
 * @author jinxing
 */

import Vue from 'vue'
import VueRouter from './vue-fake-router'
import Main from './pages/main.vue'
import Home from './pages/home.vue'
import { functionalTool, reachBottomNotify } from './utils'

const routes = [
	{
		path: '/main',
		component: Main
	},
	{
		path: '/home',
		component: Home
	}
]

const router = new VueRouter({
	routes
})

Vue.use(VueRouter);
Vue.use(reachBottomNotify);
Vue.use(functionalTool);

new Vue({
	el: '#app',
	router,
	// created() {
	// 	console.log(this.$options)
	// },
	render: h => h('router-view')
	// render: (h) => h(Main)
})