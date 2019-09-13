/**
 * @file 小程序核心逻辑层
 * @author jinxing
 */

 class Bridge {
    createView(id) {
        return new Promise(resolve => {
            const frame = document.createElement('iframe')
            frame.id = id
            frame.src = './view.html'
            frame.onload = resolve
            document.body.appendChild(frame)
        })
    }

    postMessage(id, message) {
        const target = document.querySelector('#' + id)
        target.contentWindow.postMessage(message)
    }

    onMessage(callback) {
        window.addEventListener('message', function(event) {
            callback && callback(event.data)
        })
    }
 }

 window.__bridge = new Bridge()