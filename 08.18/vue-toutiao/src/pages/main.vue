<template>
	<div>
		<component
			v-for="(item, index) in dataList"
			v-bind="item.data"
			:key="index"
			:is="item.type | formatComponentName"
		>
		</component>
	</div>
</template>

<script>
	import * as components from '../components/items'

	const convertPlainObject = obj => Object.keys(obj).reduce((res, key) => (res[key] = obj[key], res), {});

	export default {
		data() {
			return {
				dataList: []
			}
		},
		created() {
			this.getDataList().then(res=> {
				this.dataList = res
			})
		},
		methods: {
			getDataList() {
				return fetch(`/list`)
		            .then(res => res.json())
		            .then(res => res.data);
			}
		},
		filters: {
			formatComponentName: componentName => componentName
            .replace(/^\w/g, name => name.toUpperCase())
		},
		components: {
			...convertPlainObject(components)
		}
	}
</script>
