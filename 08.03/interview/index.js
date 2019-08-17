// 1.1
(function () {
    console.group('1.1')

    function show1() {
        console.log('this:', this)
    }

    var obj1 = {
        show: show1
    }
    obj1.show()

    // { show: f }

    function show2() {
        console.log('this:', this)
    }

    var obj2 = {
        show: function () {
            show2()
        }
    }
    obj2.show()
    // window {}

    console.groupEnd()
})()
// 1.2
;(function () {
    console.group('1.2')
    var obj = {
        show: function () {
            console.log('this:', this)
        }
    };
    (0, obj.show)() // 先返回一个函数 再括号执行 所以是由window调用
    // window {}
    console.groupEnd()
})()
// 1.3
;(function () {
    console.group('1.3')
    var obj = {
        sub: {
            show() {
                console.log('this:', this)
            }
        }
    }
    obj.sub.show() // 指向点前第一个，也就是sub
    // { show: f }
    console.groupEnd()
})()
// 1.4
;(function () {
    console.group('1.4')
    var obj = {
        show: function () {
            console.log('this:', this)
        }
    }
    var newObj = new obj.show() // new 优先级最高 new什么就指向什么
    // show: {}
    console.groupEnd()
})()
// 1.5
;(function () {
    console.group('1.5')
    var obj = {
        show: function () {
            console.log('this:', this)
        }
    }
    var newObj = new (obj.show.bind(obj))() // 这里的obj.show就是指向obj的，再bind一下...好像没什么用
    // show: {}
    console.groupEnd()
})()
// 1.6
;(function () {
    console.group('1.6')
    console.log('题目与1.5重复')
    console.groupEnd()
})()
// 1.7
;(function () {
    console.group('1.7')
    var obj = {
        show: function () {
            console.log('this:', this)
        }
    }
    document.addEventListener('click', obj.show) // 传入函数 addEventListener 事件会将函数中的this自动绑定到对应的dom上去
    document.addEventListener('click', obj.show.bind(obj)) // 显式绑定优先级大于 addEventListener 事件 所以指向obj
    document.addEventListener('click', function () { // addEventListener 事件改编function内部的this 但是由于show函数还是由obj调用 所以指向obj
        obj.show()
    })
    document.getElementById('app').click()
    // #document
    // { show: f }
    // { show: f }
    console.groupEnd()
})()
// 2.1
;(function () {
    console.group('2.1')
    var person = 1

    function showPerson() {
        var person = 2
        console.log('person:', person) // 优先找同级作用域向上找
    }

    showPerson()
    // 2
    console.groupEnd()
})()
// 2.2
;(function () {
    console.group('2.2')
    var person = 1

    function showPerson() {
        console.log('person:', person) // 变量提升预处理先把所有变量赋值为 undefined
        // 有一个小问题...执行的时候同级作用域找不到难道这个变量再不会向上一层找了吗
        var person = 2
    }

    showPerson()
    // undefined
    console.groupEnd()
})()
// 2.3
;(function () {
    console.group('2.3')
    var person = 1

    function showPerson() {
        console.log('person:', person) // 优先找同级作用域向上找
        var person = 2

        function person() {
        }
    }

    showPerson()
    // f person() {}
    console.groupEnd()
})()
// 2.4
;(function () {
    console.group('2.4')
    var person = 1

    function showPerson() {
        console.log('person:', person) // 优先找同级作用域向上找
        function person() {
        } // js中函数为一等公民 函数变量优先级最大
        var person = 2
    }

    showPerson()
    // f person() {}
    console.groupEnd()
})()
// 2.5
;(function () {
    console.group('2.5')

    for (var i = 0; i < 10; i++) {
        console.log(i)
    }
    // 1, 2, 3, ..., 9

    for (var i = 0; i < 10; i++) {
        setTimeout(() => {
            console.log(i)
        }, 0)
    }
    // 10个10

    for (var i = 0; i < 10; i++) {
        (function (i) {
            setTimeout(() => {
                console.log(i)
            }, 0)
        })(i)
    }
    // 1, 2, 3, ..., 9

    for (var i = 0; i < 10; i++) {
        console.log(i)
    }
    // 1, 2, 3, ..., 9

    console.groupEnd()
})()
// 3.1
;(function () {
    console.group('3.1')

    function Person() {
        this.name = 1
        return {}
    }

    var person = new Person() // 若构造函数内部有return一个对象 则new完之后不创建新对象（若return的不是一个对象 则还是会创建新对象） 直接返回函数内部的return的对象
    console.log('name:', person.name)
    // undefined
    console.groupEnd()
})()
// 3.2
;(function () {
    console.group('3.2')

    function Person() {
        this.name = 1
    }

    Person.prototype = {
        show: function () {
            console.log('name is ', this.name)
        }
    }
    var person = new Person()
    person.show()
    // 1
    console.groupEnd()
})()
// 3.3
;(function () {
    console.group('3.3')

    function Person() {
        this.name = 1
    }

    Person.prototype = {
        name: 2,
        show: function () {
            console.log('name is ', this.name)
        }
    }
    var person = new Person()
    Person.prototype.show = function () {
        console.log('new show')
    }
    person.show()
    // new show
    console.groupEnd()
})()
// 3.4
;(function () {
    console.group('3.4')

    function Person() {
        this.name = 1
    }

    Person.prototype = {
        name: 2,
        show: function () {
            console.log('name is ', this.name)
        }
    }
    var person1 = new Person()
    var person2 = new Person()
    Person.prototype.show = function () {
        console.log('new show')
    }
    person1.show()
    // new show
    person2.show()
    // new show
    console.groupEnd()
})()
// 4
;(function () {
    console.group('4')

    function Person() {
        this.name = 1
    }

    Person.prototype = {
        name: 2,
        show: function () {
            console.log('name is ', this.name)
        }
    }
    Person.prototype.show()
    // 2
    ;(new Person()).show()
    // 1
    console.groupEnd()
})()