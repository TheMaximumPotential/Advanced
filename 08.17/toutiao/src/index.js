/**
 * @file 文件入口
 * @author jinxing
 */

import Vue from 'vue'
import Main from './main.vue'

const vm = new Vue({
	el: '#app',
	render: h => h(Main)
})