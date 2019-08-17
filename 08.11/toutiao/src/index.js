/**
 * @file 管理全局的入口文件
 * @author jinxing
 */
import { data } from './data' 
import components from './items'


class Manager {

	constructor($container) {
		this.$container = $container
	}

	init() {
		const items = data
		items.forEach(item => {
			const componentName = item.type.replace(/^\w/g, v => v.toUpperCase())
			const Component = components[componentName]
			const currentComponent = new Component(item)
			const constructElememt = currentComponent.constructElememt()
			this.$container.appendChild(constructElememt)
		})
	}

	static getInstance($container) {
		return new Manager($container)
	}
}


const $container = document.getElementById('container')
const manager = Manager.getInstance($container)
manager.init()