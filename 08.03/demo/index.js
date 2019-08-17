(function () {

    function prepare() {

        const canvas = document.getElementById('canvas')
        const context = canvas.getContext('2d')
        const cvsWidth = canvas.width
        const cvsHeight = canvas.height
        const allSpriteImg = new Image()
        const heroImg = new Image()
        console.log('width:', cvsWidth, '  height:', cvsHeight)

        const imgTask = (img, src) => {
            return new Promise((resolve, reject) => {
                img.onload = resolve
                img.onerror = reject
                img.src = src
            })
        }

        const allResourceTask = Promise.all([
            imgTask(allSpriteImg, './all.jpg'),
            imgTask(heroImg, './hero.png')
        ])

        return {
            getContext(callback) {
                allResourceTask.then(() => {
                    console.log('所有图片加载完毕')
                    callback && callback({ context, heroImg, allSpriteImg, cvsWidth, cvsHeight })
                })
            }
        }
    }

    function drawImg({ context, heroImg, allSpriteImg, cvsWidth, cvsHeight }) {

        const hero = {
            img: heroImg,
            direction: 0, // 0下  1上  2左  3右
            imgCut: {
                x: 0,
                y: 0,
                width: 32,
                height: 32,
                currentX: 0,
                currentY: 0
            },
            imgPos: {
                x: 0,
                y: 0,
                width: 32,
                height: 32,
            },
            draw,
            move({ monsterList }, callback) {
                window.addEventListener('keydown', (e) => {
                    console.log(e.keyCode)
                    context.clearRect(0, 0, cvsWidth, cvsHeight)
                    let oldX = this.imgPos.x,
                        oldY = this.imgPos.y
                    switch (e.keyCode) {
                        case 37:
                            this.direction = 2
                            this.imgCut.currentX--
                            this.imgCut.y = 32
                            if (this.imgCut.currentX < 0) {
                                this.imgCut.currentX = 3
                            }
                            this.imgCut.x = this.imgCut.width * this.imgCut.currentX
                            this.imgPos.x -= this.imgCut.width
                            if (this.imgPos.x < 0) {
                                this.imgPos.x = 0
                            }
                            break
                        case 38:
                            this.direction = 1
                            this.imgCut.currentY++
                            this.imgCut.y = 96
                            if (this.imgCut.currentY > 3) {
                                this.imgCut.currentY %= 4
                            }
                            this.imgCut.x = this.imgCut.width * this.imgCut.currentY
                            this.imgPos.y -= this.imgCut.height
                            if (this.imgPos.y < 0) {
                                this.imgPos.y = 0
                            }
                            break
                        case 39:
                            this.direction = 3
                            oldX = this.imgPos.x
                            this.imgCut.currentX++
                            this.imgCut.y = 64
                            if (this.imgCut.currentX > 3) {
                                this.imgCut.currentX %= 4
                            }
                            this.imgCut.x = this.imgCut.width * this.imgCut.currentX
                            this.imgPos.x += this.imgCut.width
                            if (this.imgPos.x > cvsWidth - this.imgCut.height) {
                                this.imgPos.x = cvsWidth - this.imgCut.height
                            }
                            break
                        case 40:
                            this.direction = 0
                            this.imgCut.currentY--
                            this.imgCut.y = 0
                            if (this.imgCut.currentY < 0) {
                                this.imgCut.currentY = 3
                            }
                            this.imgCut.x = this.imgCut.width * this.imgCut.currentY
                            this.imgPos.y += this.imgCut.height
                            if (this.imgPos.y > cvsHeight - this.imgCut.height) {
                                this.imgPos.y = cvsHeight - this.imgCut.height
                            }
                            break
                        default:
                            break
                    }
                    let flag = inspectProhibit(this.imgPos, monsterList)
                    !flag && (this.imgPos.x = oldX, this.imgPos.y = oldY)
                    callback && callback(this.direction, this.imgPos, e.keyCode === 32)
                    this.draw()
                })
            },
            init({ monsterList }) {
                this.draw()
                hero.move({ monsterList }, (heroDirection, heroPos, spaceBool) => {
                    console.group('攻击数据')
                    console.log('英雄方向：')
                    console.log(heroDirection)
                    console.log('英雄定位：')
                    console.log(heroPos)
                    console.log('按下的是否为攻击键(空格)：')
                    console.log(spaceBool)
                    console.groupEnd()
                    map.draw()
                    monsterList.forEach(v => {
                        if (spaceBool) {
                            switch (heroDirection) {
                                case 0:
                                    (v.imgPos.x === heroPos.x && heroPos.y + heroPos.height === v.imgPos.y) && v.reduce()
                                    break
                                case 1:
                                    (v.imgPos.x === heroPos.x && v.imgPos.y + v.imgPos.height === heroPos.y) && v.reduce()
                                    break
                                case 2:
                                    (v.imgPos.y === heroPos.y && v.imgPos.x + v.imgPos.width === heroPos.x) && v.reduce()
                                    break
                                case 3:
                                    (v.imgPos.y === heroPos.y && heroPos.x + heroPos.width === v.imgPos.x) && v.reduce()
                                    break
                                default:
                                    break
                            }
                        }
                        console.log(v.lifeValue)
                        v.lifeValue > 0 && v.draw()
                    })
                })
            }
        }

        const Monster = function (imgCut = { x: 693, y: 132 }, imgPos = { x: 96, y: 96 }, lifeValue = 100) {
            this.img = allSpriteImg
            this.lifeValue = lifeValue
            this.imgCut = {
                x: imgCut.x,
                y: imgCut.y,
                width: 32,
                height: 32
            }
            this.imgPos = {
                x: imgPos.x,
                y: imgPos.y,
                width: 32,
                height: 32,
            }
        }

        Monster.prototype = {
            draw() {
                draw.call(this)
                context.font = "18px bold 黑体";
                context.fillStyle = "red";
                context.textAlign = "center";
                context.textBaseline = "middle";

                let y = this.imgPos.y + this.imgPos.height + 18
                if (this.imgPos.y === cvsHeight - this.imgPos.height) {
                    y = this.imgPos.y - 18
                }

                context.fillText(this.lifeValue, this.imgPos.x + this.imgPos.width / 2, y);
            },
            reduce() {
                if (this.lifeValue === 0) return
                this.lifeValue -= 10
                console.log('受到攻击')
                if (this.lifeValue <= 0) {
                    this.lifeValue = 0
                    this.imgPos = {}
                    console.log('怪物死亡')
                }
            },
            init() {
                this.draw()
            }
        }

        // 生成随机坐标的函数
        const randomPos = randomPosFn()

        const monster = new Monster(undefined, randomPos())
        monster.prototype = Object.create(Monster.prototype)

        const greenMonster = new Monster({ x: 661, y: 132 }, randomPos())
        monster.prototype = Object.create(Monster.prototype)

        // const monster = {
        //     img: allSpriteImg,
        //     imgCut: {
        //         x: 693,
        //         y: 132,
        //         width: 32,
        //         height: 32
        //     },
        //     imgPos: {
        //         x: 96,
        //         y: 96,
        //         width: 32,
        //         height: 32,
        //     },
        //     draw,
        //     init() {
        //         this.draw()
        //     }
        // }

        const map = {
            img: allSpriteImg,
            imgCut: {
                x: 32,
                y: 0,
                width: 32,
                height: 32
            },
            imgPos: {
                x: 0,
                y: 0,
                width: 32,
                height: 32,
            },
            draw() {
                let xNum = cvsWidth / this.imgCut.width
                let yNum = cvsHeight / this.imgCut.height
                this.imgPos.x = 0
                this.imgPos.y = 0
                for (let i = 0; i < xNum; i++, this.imgPos.x += this.imgCut.width) {
                    for (let j = 0; j < yNum; j++, this.imgPos.y += this.imgCut.height) {
                        // console.log('x:', this.imgPos.x, '  y:', this.imgPos.y)
                        draw.call(this)
                    }
                    this.imgPos.y = 0
                }
            },
            init() {
                this.draw()
            }
        }

        // 添加禁止位移区域数组
        // 怪物数组
        const monsterList = []
        monsterList.push(monster, greenMonster)

        //初始化游戏
        init()

        function init() {
            // 地图初始化
            map.init()
            // 怪物初始化
            monsterList.forEach(v => v.init())
            // 英雄初始化
            hero.init({ monsterList })
        }

        // 检查碰撞
        function inspectProhibit(heroConf, monsterList) {
            return monsterList.every(v => {
                const x = v.imgPos.x,
                    y = v.imgPos.y,
                    width = v.imgPos.width,
                    height = v.imgPos.height
                // console.group('禁止区域数据比较')
                // console.log(heroConf.x + heroConf.width, x)
                // console.log(heroConf.x, x + width)
                // console.log(heroConf.y + heroConf.height, y)
                // console.log(heroConf.y, y + height)
                // console.groupEnd()
                return !(heroConf.x + heroConf.width > x && heroConf.x < x + width && heroConf.y + heroConf.height > y && heroConf.y < y + height)
            })
        }

        // 缓存坐标值
        function randomPosFn() {

            let cache = []

            return function () {
                return handleRepeat(cache)
            }
        }

        // 生成不重复的坐标
        function handleRepeat(cache) {
            let pos = posFn()
            let flag = true
            if (!cache.length) {
                cache.push(pos)
            } else {
                flag = cache.every(v => {
                    return pos.x !== v.x && pos.y !== v.y
                })
                if (flag) {
                    cache.push(pos)
                } else {
                    handleRepeat(cache)
                    return
                }
            }
            return pos
        }

        // 根据画布大小生成随机坐标
        function posFn() {
            let a = Math.floor(cvsWidth / 32) - 1
            let b = Math.floor(cvsHeight / 32) - 1
            return {
                x: randomNum(1, a) * 32,
                y: randomNum(1, b) * 32,
            }
        }

        // 范围内随机数
        function randomNum(minNum, maxNum) {
            switch (arguments.length) {
                case 1:
                    return parseInt(Math.random() * minNum + 1, 10)
                case 2:
                    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
                default:
                    return 0
            }
        }

        // 画图
        function draw() {
            context.drawImage(
                this.img,
                this.imgCut.x,
                this.imgCut.y,
                this.imgCut.width,
                this.imgCut.height,
                this.imgPos.x,
                this.imgPos.y,
                this.imgPos.width,
                this.imgPos.height
            )
        }
    }

    prepare().getContext(drawImg)

})()