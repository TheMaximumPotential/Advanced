export default class VueRouter {
	constructor(options) {
		this.routes = options.routes
	}
	static install: (Vue, options) => {
		Vue.component('router-view', {
			render(createElement) {
				return createElement('div')
			}
		})
	}
}