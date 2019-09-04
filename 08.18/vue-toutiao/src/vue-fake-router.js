export default class VueRouter {

	constructor(options) {
		this.routes = options.routes
		this.history = new History()
		this.history.listen((path) => {
			this.vm.$forceUpdate()
		})
	}

	static install(Vue, options) {
		Vue.mixin({
			created() {
				if (this.$options.router) {
					this.$options.router.vm = this
					this.$router = this.$options.router
				} else {
					this.$router = this.$parent.$router
				}
			}
		})
		Vue.component('router-view', {
			functional: true,
			render(createElement, { props, children, parent }) {
				const router = parent.$router
				const hash = location.hash
				const currentRouter = matcher(hash, router.routes)
				return createElement(currentRouter.component)
			}
		})
		Vue.component('router-link', {
			props: {
				to: {
					type: String,
					require: true
				}
			},
			render(createElement) {
				const path = this.$options.propsData.to
				const text = this.$slots.default[0].text
				console.log(text)
				return createElement('a', {
					attrs: {
						href: '#' + path
					},
					domProps: {
					    innerHTML: text
					}
				})
			}
		})
	}
}

class History {
	listen(callback) {
		window.addEventListener('hashchange', (e) => {
			const hash = window.location.hash
			callback && callback(hash.replace(/^#/, ''))
		})
	}
	push(path) {
		window.location.hash = '#' + path
	}
	back() {
		window.location.back()
	}
}

function matcher(path, routerConfig) {
	return routerConfig.find(router => {
		return router.path === path.replace(/^#/, '')
	})
}