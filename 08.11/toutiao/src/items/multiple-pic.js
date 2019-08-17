/**
 * @file 多图模板文件
 * @author jinxing
 */

import Component from './component'

export default class MultiplePic extends Component {
	constructor(props) {
		super(props)
	}
	render() {
		const { data } = this.props
		return '<div>我是多图模板</div>'
	}
}