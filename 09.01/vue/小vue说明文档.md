
#### 实现一个简单数据绑定的Vue类

只在修改视图中绑定的data数据时重新渲染页面

此文面向小白...此文面向小白...此文面向小白...啰嗦了很多废话...求大佬轻喷

先贴一段代码 表示要实现哪些功能

```js
new Vue({
    el: "#app",
    data() {
        return {
            infos: {
                title: 'vue实现',
                default: '默认'
            },
            price: 27
        }
    },
    render(createElement) {
        return createElement('div', {
            attrs: {
                title: this.infos.title
            }
        }, [
            createElement('span', {}, this.price)
        ])
    }
})
```

##### 思路

1. 创建一个Vue类，然后保存一下对应上方传入Vue实例中的数据

  ```js
  class Vue {
      constructor(options) {
          this.$el = document.querySelector(options.el)
          this._data = options.data && options.data()
          this.render = options.render
      }
  }
  ```

2. 要渲染页面少不了render中的 createElement 函数

  ```js
  // 此方法在Vue类中
  _createElement(tagName, data, children) {
      const tag = document.createElement(tagName)
      const { attrs = {} } = data
      for (let attrName in attrs) {
          tag.setAttribute(attrName, attrs[attrName])
      }
      // createElement传入的第三个参数如果不是数组呢么直接渲染文本节点，如果是数组则循环遍历将child添加为当前创建tag的子节点
      // 这里可能有些人不理解说数组里的child不是createElement函数吗为什么可以直接添加为tag的子节点?
      // 因为函数执行前要先处理参数，意未参数中的createElement函数先于外部createElement函数执行，当外部createElement函数执行时形参中第三个参数的createElement数组已经变成了dom节点数组，即可直接添加为当前tag子节点
      // 此为一个树形渲染，无论套多少层，都是从树梢末端处先执行，然后一层一层向上，即上一层可直接添加为子节点
      if (Object.prototype.toString.call(children) !== '[object Array]') {
          let child = document.createTextNode(children)
          tag.appendChild(child)
      } else {
          children.forEach(child => tag.appendChild(child))
      }
      return tag
  }
  ```

3. 现在做一个小的代理函数，将data的数据代理到this实例上

  ```js
  // 做一个小代理函数
  function proxy(target, data, key) {
      // 简单解释一下这个函数 当调用target[key]是会触发获取的get函数返回data[key]值
      // 我们下面会将this作为第一个参数, data为第二个参数，data里的每一个key是第三个参数
      // 意思就是当调用this[key]的时候会触发get此时返回的是data中的数据，就是把data对象中所有第一层的数据代理到this上，因为对象是引用类型，this代理data只需要代理第一层
      Object.defineProperty(target, key, {
          get() {
              return data[key]
          },
          set(newValue) {
              data[key] = newValue
          }
      })
  }
  // 修改Vue类
  class Vue {
      constructor(options) {
          this.$el = document.querySelector(options.el)
          this._data = options.data && options.data()
          this.render = options.render
          // 加了下面三行 
  		for (let key in this._data) {
  			proxy(this, this._data, key)
  		}
      }
  }
  ```

4. 刚刚把data数据代理到了this上，现在只差一个update更新视图函数就能在页面上看到要渲染的数据了

  ```js 
  // update简单来说就做了三件事 
  // 1. 把createElement函数放到render函数里执行一下，生成dom节点
  // 2. 然后用生成的节点代替一开始传进来的$el生成的节点
  // 3. 更新一下现在的this.$el为生成的新节点
  // 此方法也在Vue类内部
  _update() {
      const $root = this.render(this._createElement)
      api.replaceChild(this.$el, $root)
      this.$el = $root
  }
  // 外部定义的一个换节点的工具函数
  const api = {
      replaceChild: (oldElement, element) => {
          return oldElement.parentElement.replaceChild(element, oldElement)
      }
  } 
  ```

5. 现在可以在Vue类中调用this._update了，贴一下现在Vue类上完整的代码

  ```js
  class Vue {
      constructor(options) {
          this.$el = document.querySelector(options.el)
          this._data = options.data && options.data()
          this.render = options.render
          for (let key in this._data) {
              proxy(this, this._data, key)
          }
          this._update()
      }
  
      _update() {
          const $root = this.render(this._createElement)
          api.replaceChild(this.$el, $root)
          this.$el = $root
      }
  
      _createElement(tagName, data, children) {
          const tag = document.createElement(tagName)
          const { attrs = {} } = data
          for (let attrName in attrs) {
              tag.setAttribute(attrName, attrs[attrName])
          }
          if (Object.prototype.toString.call(children) !== '[object Array]') {
              let child = document.createTextNode(children)
              tag.appendChild(child)
          } else {
              children.forEach(child => tag.appendChild(child))
          }
          return tag
      }
  }
  ```

6. 现在页面上已经可以显示出要渲染的数据了，现在开始有点难了，修改数据更新视图，而且只能在绑定到视图上的数据发生变化时才更新视图

  ```js
  // 先做一个依赖收集，把视图上用到的data中的数据统计出来，由于之前把data代理了一层到this上，修改深层数据set函数监听不到，所以现在要做一个递归函数，能监听到所有值的变化的类
  class Observe {
      constructor(obj) {
          this.walk(obj)
      }
      // walk函数递归将所有的属性都代理到了自己的上一层
      walk(obj) {
          Object.keys(obj).forEach(key => {
              if (typeof obj[key] === 'object'
                  && obj[key] !== null
                 ) {
                  this.walk(obj[key])
              }
              defineReactive(obj, key, obj[key])
          })
          return obj
      }
  }
  // 代理 原理同上面的proxy
  function defineReactive(target, key, value) {
      Object.defineProperty(target, key, {
          get() {
              return value
          },
          set(newValue) {
              value = newValue
          }
      })
  }

   // 写了上面的函数现在就可以去监听一下Vue中的data了
   class Vue {
       constructor(options) {
           this.$el = document.querySelector(options.el)
           this._data = options.data && options.data()
           // 加了下面这一行
           new Observe(this._data)
           this.render = options.render
           for (let key in this._data) {
               proxy(this, this._data, key)
           }
       }
   }
  ```

7. 现在每一层的数据变化都能监听到了，现在需要做一个小的发布订阅模式的类来订阅哪些属性更新的时候更新视图

  ```js
  // 这个类 不是在一次render函数的执行中把this调用的数据放到下面Dep类的数组里，而是在递归代理的时候给每一个属性声明一个Dep类，有调了属性的get方法的，把当前可以更新视图的函数push到当前属性的dep数组里，给大佬(属性的Dep)递我(可以更新视图的类)
  // 下面的我，都代指可以更新视图的类
  // 可能这里有点反向的思想不好理解
  // Dep大佬在此
  class Dep {
      constructor() {
          // 小迷弟队列
          this.subs = []
      }
  	// 添加到队列
      addSub(sub) {
          // 去重
          if (this.subs.indexOf(sub) < 0) {
              this.subs.push(sub)
          }
      }
  	// 清空队列，让小迷弟们去更新视图
      notify() {
          const subs = this.subs.slice()
          subs.forEach(sub => sub.update())
      }
  }
  ```

8. 递归代理的时候要把我(可以更新视图的类)扔到当前属性的dep里，呢怎么拿到当前的我呢，我们做一个全局变量，在获取前，把我放上去，获取结束了再把我扔了

  ```js
  // 我代指可以更新视图的类
  // 来一个全局静态变量
  Dep.targets = []
  // 把我挂上全局
  function pushTarget(instance) {
      Dep.targets.push(instance)
  }
  // 把我从全局扔了
  function popTarget() {
      return Dep.targets.pop()
  }
  // 然后改一下递归代理
  function defineReactive(target, key, value) {
      // 每个属性一个dep
      const dep = new Dep()
      Object.defineProperty(target, key, {
          get() {
              // 判断一下我(this)在不在全局上
              if (Dep.targets.length) {
                  // 下面这个方法 正是给大佬(属性的Dep)递我(可以更新视图的类) 但是还没写
                  // dep.addDepend()
              }
              return value
          },
          set(newValue) {
              value = newValue
          }
      })
  }
  ```

9. 现在来写我，我是一个有试图更新功能的watcher

  ```js
  // watcher 我在此
  class Watcher {
      // 这里的getter函数就是传进来update函数
      constructor(getter, callback) {
          this.callback = callback
          this.getter = getter
          this.value = this.get()
      }
      // getter函数做一个小封装
      // 因为之前说了，在更新视图的时候要调很多this上的数据，要给每个大佬递我
      // 所以在update之前就要吧我(this，就是现在这个可以更新视图的watcher扔到全局去)
  	// 然后getter函数也就是update函数执行的过程中有使用this数据触发代理的get函数了
      // 而上面代理的get函数判断了一下，要是全局有我，就执行大佬来喊我的addDepend函数 下面会加
      get() {
          pushTarget(this)
          let value = this.getter()
          popTarget()
          return value
      }
  	// 这里的addDep就是给大佬递我
      addDep(dep) {
          dep.addSub(this)
      }
  	// 更新视图的方法
      update() {
          console.log('更新视图')
          let newValue = this.get()
          return newValue
      }
  }
  
  // 现在在Dep大佬身上多一个喊我的方法
  class Dep {
  	// 大佬来喊全局的我，快把你递给我
      addDepend() {
         	// 全局的我就执行了把给大佬递我的addDep方法
          Dep.targets[Dep.targets.length - 1].addDep(this)
      }
  }
  ```

10. 现在为止...但凡在render里调了this上数据的大佬，我都会大佬的迷弟队列里待命，一旦大佬的数据改了，我就会跑去更新下视图...

   ```js
   // 再来改一下递归代理这里
   function defineReactive(target, key, value) {
       const dep = new Dep()
       Object.defineProperty(target, key, {
           get() {
               if (Dep.targets.length) {
                   dep.addDepend()
               }
               return value
           },
           set(newValue) {
               value = newValue
   			// set设置值的时候清空当前大佬dep的小迷弟队列
               dep.notify()
           }
       })
   }
   ```

11. 最后一步Watcher加到Vue里

   ```js
   class Vue {
       constructor(options) {
           this.$el = document.querySelector(options.el)
           this._data = options.data && options.data()
           new Observe(this._data)
           this.render = options.render
           for (let key in this._data) {
               proxy(this, this._data, key)
           }
           new Watcher(() => {
               this._update()
           }, () => {
               console.log('callback')
           })
       }
   }
   ```



数据绑定完成！ 我把实例挂到window上了

可以修改window.app.price = xxx查看

修改window.app.infos.default视图上没有的属性则不更新视图

###### 下面贴一波完整的源码

```js + html
<div id="app"></div>

<script type="text/javascript">
	class Vue {
		constructor(options) {
			this.$el = document.querySelector(options.el)
			this._data = options.data && options.data()
			new Observe(this._data)
			this.render = options.render
			for (let key in this._data) {
				proxy(this, this._data, key)
			}
			new Watcher(() => {
				this._update()
			}, () => {
				console.log('callback')
			})
		}

		_update() {
			const $root = this.render(this._createElement)
			api.replaceChild(this.$el, $root)
			this.$el = $root
		}

		_createElement(tagName, data, children) {
			const tag = document.createElement(tagName)
			const { attrs = {} } = data
			for (let attrName in attrs) {
				tag.setAttribute(attrName, attrs[attrName])
			}
			if (Object.prototype.toString.call(children) !== '[object Array]') {
				let child = document.createTextNode(children)
				tag.appendChild(child)
			} else {
				children.forEach(child => tag.appendChild(child))
			}
			return tag
		}
	}

	class Dep {
		constructor() {
			this.subs = []
		}

		addSub(sub) {
			if (this.subs.indexOf(sub) < 0) {
				this.subs.push(sub)
			}
		}

		notify() {
			const subs = this.subs.slice()
			subs.forEach(sub => sub.update())
		}

		addDepend() {
			Dep.targets[Dep.targets.length - 1].addDep(this)
		}
	}

	Dep.targets = []

	function pushTarget(instance) {
		Dep.targets.push(instance)
	}

	function popTarget() {
		return Dep.targets.pop()
	}

	class Watcher {
		constructor(getter, callback) {
			this.callback = callback
			this.getter = getter
			this.value = this.get()
		}

		get() {
			pushTarget(this)
			let value = this.getter()
			popTarget()
			return value
		}

		addDep(dep) {
			dep.addSub(this)
		}

		update() {
			console.log('更新视图')
			let newValue = this.get()
			return newValue
		}
	}

	class Observe {
		constructor(obj) {
			this.walk(obj)
		}

		walk(obj) {
			Object.keys(obj).forEach(key => {
				if (typeof obj[key] === 'object'
					&& obj[key] !== null
				) {
					this.walk(obj[key])
				}
				defineReactive(obj, key, obj[key])
			})
			return obj
		}
	}

	function proxy(target, data, key) {
		Object.defineProperty(target, key, {
			get() {
				return data[key]
			},
			set(newValue) {
				data[key] = newValue
			}
		})
	}

	function defineReactive(target, key, value) {
		const dep = new Dep()
		Object.defineProperty(target, key, {
			get() {
				if (Dep.targets.length) {
					dep.addDepend()
				}
				return value
			},
			set(newValue) {
				value = newValue
				dep.notify()
			}
		})
	}

	const api = {
		replaceChild: (oldElement, element) => {
			return oldElement.parentElement.replaceChild(element, oldElement)
		}
	} 

	window.app = new Vue({
		el: "#app",
		data() {
			return {
				infos: {
					title: 'vue实现',
					default: '默认'
				},
				price: 27
			}
		},
		render(createElement) {
			return createElement('div', {
				attrs: {
					title: this.infos.title
				}
			}, [
				createElement('span', {}, this.price)
			])
		}
	})
</script>
```
