(function (global) {

    function Promise(processor) {
        this._status = 'pending'
        if (!processor) return
        processor(
            (res) => {
                this._resolve(res)
            },
            (err) => {
                this._reject(err)
            }
        )
    }

    Promise.prototype = {

        constructor: Promise,

        then(onFulfilled) {
            this.onFulfilled = onFulfilled
            this.next = new Promise()
            if (this._status === 'fulfilled') {
                this._taskCallback(
                    this.currentValue,
                    this.onFulfilled.bind(this),
                    this.next
                )
            }
            return this.next
        },
        catch(onRejected) {
            if (!onRejected || this._status === 'fulfilled') return
            this.onRejected = onRejected
            this.next = new Promise()
            if (this._status === 'rejected') {
                this._taskCallback(
                    this.currentErr,
                    this.onRejected.bind(this),
                    this.next
                )
            }
            return this.next
        },
        _taskCallback(value, processor, next) {
            let result = null,
                normal = 1
            try {
                result = processor(value)
            } catch (err) {
                normal = 0
                result = err
            }
            if (result instanceof Promise) {
                result.next = next
                result.then(function (res) {
                    next._resolve(res)
                })
                result.catch(function (err) {
                    next._reject(err)
                })
                return
            }
            if (normal) {
                next._resolve(result)
            } else {
                next._reject(result)
            }
        },
        _resolve(res) {
            if (this._status === 'rejected') return
            this._status = 'fulfilled'
            this.currentValue = res
            if (this.next && this.onFulfilled) {
                this._taskCallback(
                    this.currentValue,
                    this.onFulfilled.bind(this),
                    this.next
                )
            }
        },
        _reject(err) {
            if (this._status === 'fulfilled') return
            this._status = 'rejected'
            this.currentErr = err
            if (this.next && this.onRejected) {
                this._taskCallback(
                    this.currentErr,
                    this.onRejected.bind(this),
                    this.next
                )
            }
        },
        onFulfilled(res) {
            this.next._resolve(res)
        },
        onRejected(err) {
            this.next._reject(err)
        }
    }

    global.Promise = Promise
})(window)