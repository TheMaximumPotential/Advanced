/**
 * @file 小程序核心逻辑层
 * @author jinxing
 */

 (function (global) {
    const classMap = {}

    class Logic {

        init() {
            let firstPageUri = window.appJson.pages[0]
            this.uniqIndex = 0
            this.navigateTo(firstPageUri)
        }

        _generatorUniqId() {
            return 'id' + this.uniqIndex++
        }

        navigateTo(uri) {
            const pageClass = classMap[uri]
            new pageClass(this._generatorUniqId(), uri)
        }
    }

    class PageBase {
        constructor(id, uri) {
            this.id = id
            this.uri = uri
            this._initData()
            this._render().then(() => {
                global.__bridge.postMessage(this.id, {
                    data: this.data
                })
            })
        }

        _initData() {
            this.data = JSON.parse(JSON.stringify(this.data))
        }

        _render() {
            return global.__bridge.createView(this.id)
                .then(frame => {
                    this.$el = frame
                })
        }

        setState() {

        }
    }


    const createPageClass = options => {
        class Page extends PageBase {
            constructor(...args) {
                super(...args)
            }
        }
        Object.assign(Page.prototype, options)
        return Page
    }

    const Page = (uri, options) => {
        classMap[uri] = createPageClass(options)
    }

    global.logic = new Logic()
    global.Page = Page

 })(window)