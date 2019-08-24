/**
 * @file utils插件总入口
 * @author jinxing
 */

import echarts from 'echarts'

// 节流忽略（当前函数没有执行完后面的函数就不执行）
const createdThrottle = (fn, delay = 1000) => {
	let _status = "START"
	return () => {
		if (_status === "WAITING") return
		_status = "WAITING"
		setTimeOut(() => {
			fn && fn()
			this._status = "START"
		}, delay)
	}
}

// 防抖打断（后一个函数一旦被执行则重置定时器，按照后一个函数执行）
const createdDebounce = (fn, delay = 1000) => {
	let timmer = null
	return args => {
		clearTimeOut(timer)
		timmer = setTimeOut(() => {
			fn && fn(args)
		}, delay)
	}
}

// 新增触底节流生命周期
const reachBottomNotify = {
	install: (Vue, options) => {
		Vue.mixin({
			data() {
				const data = {
					scrollQueue: []
				} 
				return this.onReachBottom ? data : {}
			},
			created() {
				if (typeof this.onReachBottom === 'function') {
					this.scrollQueue.push(() => {
						this.onReachBottom()
					})
					this._listenScroll()
				}
			},
			methods: {
				_listenScroll() {
					const THRESHOLD = 50
					const throttle = createdThrottle(() => {
						this.scrollQueue.forEach(func => func())
					})
					window.addEventListener('scroll', () => {
						const offsetHeight = document.documentElement.offsetHeight
						const screenHeight = window.screen.height
						const scrollY = window.scrollY
						const gap = offsetHeight - screenHeight - scrollY
						if (gap < THRESHOLD) {
							throttle()
						}
					})
				}
			}
		})
	}
}

// echarts
const functionalTool = {
	install: (Vue, options) => {
		Vue.mixin({
			methods: {
				createdThrottle,
				createdDebounce
			}
		}),
		Vue.components(echarts, {
			props: {
				width: {
                    type: Number,
                    default: -1
                },

                height: {
                    type: Number,
                    default: -1
                },
			},
			render: (createElement) => {
				createElement('div', {
					attr: {
						id: this.randomId
					},
					style: this.canvasStyle
				})
			},
			computed: {
				randomId() {
					return 'echarts-' + Math.floor(Math.random() * 10)
				},
				canvasStyle() {
					return {
                        height: this.height === -1 ? '100%' : this.height + 'px',
                        width: this.width === -1 ? '100%' : this.width + 'px'
                    }
				}
			},
			methods: {

			}
		})
	}
}