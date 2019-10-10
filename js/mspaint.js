/**
 * 绘图相关核心代码
 *      一切源于 click ...
 * 
 * 
 */

(function (w) {
    // 提取出来的事件处理函数 程序尚未设计完全
    // function move(e, cb) {
    //     // 转为 SVG 坐标系
    //     let newX = e.clientX - self.elOffsetX - publicVar.pointXZero,
    //     newY = e.clientY - self.elOffsetY - publicVar.pointYZero


    //     cb && cb()
    // }

    // function up(e, cb) {
    //     // 解绑事件
    //     console.log(1)
    //     document.removeEventListener('mousemove', move, false)
    //     document.removeEventListener('mouseup', up, false)

    //     cb && cb()
    // }

    class Mspaint {
        constructor({ el } = {}) {
            this.el = Tool.selectedDom(el)
            let offset = this.el.getBoundingClientRect()
            // 当前元素距离上侧, 距离左侧 偏移量
            this.elOffsetX = offset['left']
            this.elOffsetY = offset['top']
            // 事件列表 用来追踪和注销函数, 格式类型 { Select: {document: {}} }
            // this.handleList = {} 已失效
            // 核心点击事件, 为什么放置外部, 因为有一些特殊情况需要对齐进行解绑
            this.handle = (e) => {
                // 当前状态是什么, 根据状态来执行对应函数
                let status = config.CanvasStatus,
                    // 鼠标按下的坐标点, 转换为 svg 坐标系
                    curX = e.clientX - publicVar.pointXZero - this.elOffsetX,
                    curY = e.clientY - publicVar.pointYZero - this.elOffsetY

                // handel start
                this[status]({
                    curX,
                    curY,
                    e
                })
            }

            this.bindEvent(this.el)
        }

        // 绑定事件
        bindEvent(dom) {
            // 说了, 一切源于 click
            dom.addEventListener('mousedown', this.handle, false)
        }

        // Select (选择)
        Select({ curX, curY } = {}) {
            let move, up,
                self = this,
                isMove = 0,
                virtualSvg = Tool.createSvgEl('rect')

            virtualSvg.setAttribute('x', curX)
            virtualSvg.setAttribute('y', curY)
            virtualSvg.setAttribute('class', 'system-rect')

            move = function (e) {
                // 转为 SVG 坐标系
                let newX = e.clientX - self.elOffsetX - publicVar.pointXZero,
                    newY = e.clientY - self.elOffsetY - publicVar.pointYZero
                // 标记已经移动, 可以创建节点
                isMove++
                // 具体思路, 请滑至底部
                if (newX > curX) {
                    // console.log(curX, newX)
                    virtualSvg.setAttribute('x', curX)
                    // console.log( "x: " + curX, 
                    //             "width: "+ Math.abs((newX + publicVar.pointXZero) - (curX + publicVar.pointXZero))
                    // )
                    // (newX + publicVar.pointXZero) - (curX + publicVar.pointXZero)

                    virtualSvg.setAttribute('width', newX - curX)
                } else {
                    virtualSvg.setAttribute('x', newX)
                    virtualSvg.setAttribute('width', curX - newX)
                }

                if (newY > curY) {
                    virtualSvg.setAttribute('y', curY)
                    virtualSvg.setAttribute('height', newY - curY)
                } else {
                    virtualSvg.setAttribute('y', newY)
                    virtualSvg.setAttribute('height', curY - newY)
                }

                // 只触发一次
                if (isMove === 1) {
                    publicVar.canvas.appendChild(virtualSvg)
                }

            }

            up = function (e) {
                document.removeEventListener('mousemove', move, false)
                document.removeEventListener('mouseup', up, false)

                virtualSvg.remove()
            }

            document.addEventListener('mousemove', move, false)
            document.addEventListener('mouseup', up, false)
        }

        // Pencil (画笔)
        Pencil({ curX, curY } = {}) {
            let move, up,
                self = this,
                isMove = 0,
                virtualPolyline = Tool.createSvgEl('polyline'),
                points = `${curX} ${curY}` // 起点

            virtualPolyline.setAttribute('class', 'system-polyline')
            virtualPolyline.setAttribute('points', points)
            virtualPolyline.setAttribute('stroke', '#000')
            virtualPolyline.setAttribute('fill', 'none')

            move = function (e) {
                // 转为 SVG 坐标系
                let newX = e.clientX - self.elOffsetX - publicVar.pointXZero,
                    newY = e.clientY - self.elOffsetY - publicVar.pointYZero

                isMove++
                points = virtualPolyline.getAttribute('points')
                points += `, ${newX} ${newY}`
                virtualPolyline.setAttribute('points', points)

                if (isMove === 1) {
                    // 插入节点
                    publicVar.canvas.appendChild(virtualPolyline)
                }
            }

            up = function (e) {
                document.removeEventListener('mousemove', move, false)
                document.removeEventListener('mouseup', up, false)
                // 没有移动, 不应该创建
                if (isMove === 0) { return }
                // 虚拟节点的删除和实际节点的插入
                let polyline = virtualPolyline.cloneNode()
                polyline.setAttribute('class', '')
                publicVar.canvas.appendChild(polyline)
                virtualPolyline.remove()
            }

            document.addEventListener('mousemove', move, false)
            document.addEventListener('mouseup', up, false)
        }

        // Line (线段)
        Line({ curX, curY } = {}) {
            let move, up,
                self = this,
                isMove = 0,
                virtualLine = Tool.createSvgEl('line')

            // 定义以system- 开头的类名都为图形预览
            virtualLine.setAttribute('class', 'system-line')
            virtualLine.setAttribute('x1', curX)
            virtualLine.setAttribute('y1', curY)
            // 默认都是当前点, 防止取默认值, 0, 0
            virtualLine.setAttribute('x2', curX)
            virtualLine.setAttribute('y2', curY)
            virtualLine.setAttribute('stroke', '#000')

            move = function (e) {
                // 转为 SVG 坐标系
                let newX = e.clientX - self.elOffsetX - publicVar.pointXZero,
                    newY = e.clientY - self.elOffsetY - publicVar.pointYZero

                isMove++
                virtualLine.setAttribute('x2', newX)
                virtualLine.setAttribute('y2', newY)

                if (isMove === 1) { // 只有在点击鼠标并且移动后, 才应该创建元素, 而不是一点击就立马创建
                    publicVar.canvas.appendChild(virtualLine)
                }
            }

            up = function (e) {
                document.removeEventListener('mousemove', move, false)
                document.removeEventListener('mouseup', up, false)
                // 没有移动, 不应该创建
                if (isMove === 0) { return }
                // 移出虚拟节点, 插入实际节点, 先插入后删除, mutationobserver, 对同一个dom同时进行删除和插入操作的时候, 只会检测到一个变化
                let line = virtualLine.cloneNode()
                line.setAttribute('class', '')
                publicVar.canvas.appendChild(line)
                virtualLine.remove()
            }

            document.addEventListener('mousemove', move, false)
            document.addEventListener('mouseup', up, false)

        }

        // Square (方形)
        Square({ curX, curY } = {}) {
            let move, up,
                self = this,
                isMove = 0,
                virtualRect = Tool.createSvgEl('rect')

            // 定义内置类名
            virtualRect.setAttribute('class', 'system-rect2')
            virtualRect.setAttribute('x', curX)
            virtualRect.setAttribute('y', curY)
            // 默认不填充, 后面需要填充变量
            virtualRect.setAttribute('fill', 'rgba(0, 0, 0, 0)')
            virtualRect.setAttribute('stroke', '#000')

            move = function (e) {
                // 转为 SVG 坐标系
                let newX = e.clientX - self.elOffsetX - publicVar.pointXZero,
                    newY = e.clientY - self.elOffsetY - publicVar.pointYZero

                isMove++
                // 具体思路, 请滑至底部
                if (newX > curX) {
                    // console.log(curX, newX)
                    virtualRect.setAttribute('x', curX)
                    // console.log( "x: " + curX, 
                    //             "width: "+ Math.abs((newX + publicVar.pointXZero) - (curX + publicVar.pointXZero))
                    // )
                    // (newX + publicVar.pointXZero) - (curX + publicVar.pointXZero)

                    virtualRect.setAttribute('width', newX - curX)
                } else {
                    virtualRect.setAttribute('x', newX)
                    virtualRect.setAttribute('width', curX - newX)
                }

                if (newY > curY) {
                    virtualRect.setAttribute('y', curY)
                    virtualRect.setAttribute('height', newY - curY)
                } else {
                    virtualRect.setAttribute('y', newY)
                    virtualRect.setAttribute('height', curY - newY)
                }

                if (isMove === 1) {
                    // 插入节点
                    publicVar.canvas.appendChild(virtualRect)
                }

            }

            up = function (e) {
                document.removeEventListener('mousemove', move, false)
                document.removeEventListener('mouseup', up, false)
                // 没有移动, 不应该创建
                if (isMove === 0) { return }
                // 
                let rect = virtualRect.cloneNode()
                rect.setAttribute('class', '')
                publicVar.canvas.appendChild(rect)
                virtualRect.remove()
            }

            document.addEventListener('mousemove', move, false)
            document.addEventListener('mouseup', up, false)
        }

        // Circle (圆)
        Circle({ curX, curY } = {}) {
            let move, up, keyDown, keyUp,
                isMove = 0,
                self = this,
                ctrl = false, // 键盘事件
                shift = false, // 键盘事件
                alt = false, // 键盘事件
                virtualEllipse = Tool.createSvgEl('ellipse')
            // ellipse  cx cy rx ry
            // circle   cx cy r
            virtualEllipse.setAttribute('class', 'system-circle')
            virtualEllipse.setAttribute('fill', 'none')
            virtualEllipse.setAttribute('stroke', '#000')
            // virtualEllipse.setAttribute('cx', curX)
            // virtualEllipse.setAttribute('cy', curY)

            move = function (e) {
                // 转为 SVG 坐标系
                let newX = e.clientX - self.elOffsetX - publicVar.pointXZero,
                    newY = e.clientY - self.elOffsetY - publicVar.pointYZero,
                    cx, cy, rx, ry

                cx = Math.abs(newX) - Math.abs(curX)
                cy = Math.abs(newY) - Math.abs(curY)
                isMove++
                if (shift) { // 只有画正圆的时候才会计算, 下面计算公式依据勾股定理
                    ry = rx = Math.sqrt(Math.pow((curX + cx / 2) - newX, 2) + Math.pow((curY + cy / 2) - newY, 2))
                }

                // 键盘事件条件判断
                if ((!ctrl && !shift && !alt) || ctrl) { // 什么都没按
                    // console.log(cx)
                    virtualEllipse.setAttribute('cx', curX + cx / 2)
                    virtualEllipse.setAttribute('rx', Math.abs(cx / 2))

                    virtualEllipse.setAttribute('cy', curY + cy / 2)
                    virtualEllipse.setAttribute('ry', Math.abs(cy / 2))
                } else if (!ctrl && !shift && alt) { // 按下alt键, 圆心改为鼠标当前点
                    virtualEllipse.setAttribute('cx', curX + cx)
                    virtualEllipse.setAttribute('rx', Math.abs(cx))

                    virtualEllipse.setAttribute('cy', curY + cy)
                    virtualEllipse.setAttribute('ry', Math.abs(cy))
                } else if (!ctrl && shift && !alt) { // 按下shift键 画正圆, 以x轴为基准
                    // rx ry 保持一致, 求鼠标中心点坐标到移动点坐标的直线距离
                    virtualEllipse.setAttribute('cx', curX + cx / 2)
                    virtualEllipse.setAttribute('rx', rx)

                    virtualEllipse.setAttribute('cy', curY + cy / 2)
                    virtualEllipse.setAttribute('ry', ry)
                } else { // 其余情况全部画正圆, 坐标点为按下点

                    virtualEllipse.setAttribute('cx', curX)
                    // 为何扩大两倍？ 为了跟上鼠标位置
                    virtualEllipse.setAttribute('rx', rx * 2)

                    virtualEllipse.setAttribute('cy', curY)
                    virtualEllipse.setAttribute('ry', ry * 2)
                }

                if (isMove === 1) {
                    // 插入节点
                    publicVar.canvas.appendChild(virtualEllipse)
                }

            }

            up = function (e) {
                document.removeEventListener('mousemove', move, false)
                document.removeEventListener('mouseup', up, false)
                document.removeEventListener('keydown', keyDown, false)
                document.removeEventListener('keyup', keyUp, false)
                // 没有移动, 不应该创建
                if (isMove === 0) { return }
                // 
                let ellipse = virtualEllipse.cloneNode()
                ellipse.setAttribute('class', '')
                publicVar.canvas.appendChild(ellipse)
                virtualEllipse.remove()
            }

            // 键盘事件
            keyDown = function (e) {
                // e.key Shift Alt Control
                switch (e.key) {
                    case 'Shift':
                        shift = true
                        break
                    case 'Alt':
                        alt = true
                        break
                    case 'Control':
                        ctrl = true
                        break
                }
                // 阻止alt 默认事件
                e.preventDefault()
            }

            keyUp = function (e) {
                // e.key Shift Alt Control
                switch (e.key) {
                    case 'Shift':
                        shift = false
                        break
                    case 'Alt':
                        alt = false
                        break
                    case 'Control':
                        ctrl = false
                        break
                }
                // 阻止alt 默认事件
                e.preventDefault()
            }

            document.addEventListener('mousemove', move, false)
            document.addEventListener('mouseup', up, false)
            document.addEventListener('keydown', keyDown, false)
            document.addEventListener('keyup', keyUp, false)
        }

        // Path (复杂路径绘制)
        Path({ curX, curY } = {}) {
            let move, down,
                d = '',
                dArr = [
                    {
                        'M': {
                            'x': curX,
                            'y': curY
                        }
                    },
                    {
                        'L': {
                            'x': curX,
                            'y': curY
                        }
                    }],
                dArrLen = dArr.length, // 记录当前数组长度
                // 记录当前是第几条线段, 默认是1
                indexLine = 1,
                self = this,
                isMove = 0,
                virtualPath = Tool.createSvgEl('path'),
                // 虚拟方框, 标记点击位置
                vritualRectArr = [Tool.createSvgEl('rect')]

            // 解绑当前画布区的原点击事件
            this.el.removeEventListener('mousedown', this.handle, false)

            // 定义虚拟方框
            vritualRectArr[0].setAttribute('class', 'system-virtual-rect')
            vritualRectArr[0].setAttribute('x', curX - 4)
            vritualRectArr[0].setAttribute('y', curY - 4)
            vritualRectArr[0].setAttribute('width', 8)
            vritualRectArr[0].setAttribute('height', 8)

            // 定义以system- 开头的类名都为图形预览
            virtualPath.setAttribute('class', 'system-path')
            virtualPath.setAttribute('stroke', '#000')
            virtualPath.setAttribute('fill', 'rgba(0, 0, 0, 0)')
            // virtualPath.setAttribute('d', d)

            move = function (e) {
                // 转为 SVG 坐标系
                let newX = e.clientX - self.elOffsetX - publicVar.pointXZero,
                    newY = e.clientY - self.elOffsetY - publicVar.pointYZero
                // 每次移动时, d属性值需要清空
                d = ''
                // 记录次数, 数值为1, 就插入节点 代表只插入一次
                isMove++

                for (let i = 0; i < dArrLen; i++) {
                    let key = Object.getOwnPropertyNames(dArr[i]) // M L... key --- M

                    // 修改置顶属性值
                    if (i === indexLine) {
                        dArr[i][key].x = newX
                        dArr[i][key].y = newY
                    }

                    d += `${key} ${dArr[i][key].x} ${dArr[i][key].y} ` // M xxx xxxx 得出类似这样的字符
                }

                virtualPath.setAttribute('d', d)

                if (isMove === 1) { // 只有在点击鼠标并且移动后, 才应该创建元素, 而不是一点击就立马创建
                    publicVar.canvas.appendChild(virtualPath)
                    publicVar.canvas.appendChild(vritualRectArr[0])
                }
            }

            down = function (e) {
                // 转为 SVG 坐标系
                let n,
                    pointDel, //页面节点信息
                    newX = e.clientX - self.elOffsetX - publicVar.pointXZero,
                    newY = e.clientY - self.elOffsetY - publicVar.pointYZero

                // 说明点击到标记点, 结束路径, 恢复原画图区点击事件, 生成真正的path, 放置svg中
                if (e.target.classList.contains('system-virtual-rect')) {
                    // 解绑事件
                    document.removeEventListener('mousemove', move, false)
                    self.el.removeEventListener('mousedown', down, false)
                    // 恢复事件
                    self.el.addEventListener('mousedown', self.handle, false)

                    // 如果点击点为最后一个标记点, 意味着结束绘制
                    if( vritualRectArr.indexOf(e.target) === vritualRectArr.length - 1){
                        dArr.splice(dArrLen - 1)
                        dArrLen = dArr.length
                    }
                    d = ''
                    // 获取当前点的target坐标
                    for (let i = 0; i < dArrLen; i++) {
                        let key = Object.getOwnPropertyNames(dArr[i]) // M L... key --- M
    
                        // 修改置顶属性值
                        if (i === indexLine) {
                            dArr[i][key].x = parseInt(e.target.getAttribute('x')) + 4
                            dArr[i][key].y = parseInt(e.target.getAttribute('y')) + 4
                            // console.log(e.target.getAttribute('x'), e.target.getAttribute('y'), dArr[0]['M'])
                        }

                        d += `${key} ${dArr[i][key].x} ${dArr[i][key].y} ` // M xxx xxxx 得出类似这样的字符
                    }
                    // 生成path并放置
                    let path = virtualPath.cloneNode()
                    path.setAttribute('d', d)
                    path.setAttribute('class', '')
                    publicVar.canvas.appendChild(path)

                    // 清空所有虚拟节点
                    virtualPath.remove()
                    vritualRectArr.forEach(item => item.remove())

                    e.stopPropagation()
                    return
                } else {
                    pointDel = {
                        'L': {
                            'x': newX,
                            'y': newY
                        }
                    }
                }
                // 每次点击意味着属性值添加
                dArr.push(pointDel)
                dArrLen = dArr.length   // 重新记录当前数组长度
                indexLine++             // 需要更改的值的索引

                // 生产新的点击位置标记
                vritualRectArr.push(Tool.createSvgEl('rect'))
                // 记录长度
                n = vritualRectArr.length - 1
                vritualRectArr[n].setAttribute('class', 'system-virtual-rect')
                vritualRectArr[n].setAttribute('x', newX - 4)
                vritualRectArr[n].setAttribute('y', newY - 4)
                vritualRectArr[n].setAttribute('width', 8)
                vritualRectArr[n].setAttribute('height', 8)
                publicVar.canvas.appendChild(vritualRectArr[n])

            }

            document.addEventListener('mousemove', move, false)
            // 重载点击事件
            this.el.addEventListener('mousedown', down, false)
            // document.addEventListener('mouseup', up, false)
        }

        // Geometry (几何绘制)
        Geometry({ curX, curY } = {}) {

        }

        // Text (文本)
        Text({ curX, curY, e } = {}) {
            let keydown, textMousedown,
                reg = /g/i,
                self = this,
                p = document.createElement('p'),
                g = Tool.createSvgEl('g')

            // 判断页面是否含有该标签
            if (document.querySelector('#svg-p') !== null) {
                return
            }

            p.id = 'svg-p'
            // 可编辑
            p.contentEditable = true
            p.style.color = '#000'
            p.style.minWidth = '10px'
            p.style.minHeight = p.style.fontSize = '20px'
            p.style.top = `${curY + publicVar.pointYZero - 10}px`
            p.style.left = `${curX + publicVar.pointXZero}px`
            // 插入节点
            this.el.appendChild(p)
            // 自动聚焦, 插入节点竟然存在延迟, DOM还未渲染完成该节点, 就触发focus, 不起作用, 所以延迟执行
            setTimeout(() => {
                p.focus()
            }, 10);

            // 为什么用keydown，因为要阻止document原本绑定的事件
            keydown = function (e) {
                // this.innerText                
                e.stopPropagation()
            }

            // 截取, 创建, 插入, 删除 
            textMousedown = function (e) {
                let text = Tool.createSvgEl('text'),
                    str = p.innerText
                // 设置属性
                text.style.fontSize = '20px'
                text.setAttribute('fill', '#000')
                text.setAttribute('x', curX)
                text.setAttribute('y', curY + 10)
                // innerText 不起作用
                text.innerHTML = str

                g.appendChild(text)

                publicVar.canvas.appendChild(g)

                // 将p删除
                p.remove()
                // 解绑事件
                self.el.removeEventListener('mousedown', textMousedown, false)
            }
            // 新增mosuedown事件
            this.el.addEventListener('mousedown', textMousedown, false)


            p.addEventListener('keydown', keydown, false)


        }

        // Dropper (吸管)
        Dropper({ curX, curY } = {}) {

        }

    }

    new Mspaint({
        el: '.core'
    })

    // 暴露接口
    w.Mspaint = Mspaint
})(window)

/*

---------------------------------------------------------------------------------------------
    拖拽生成 矩形框实现思路
        获取当前元素在可视区中, 距离上侧及左侧偏移量, 以供下方使用
        保存鼠标按下点 离屏幕 的距离,
            假设 元素左偏移为 50px
            鼠标按下点为 300px
            那么需要将改点转为坐标系对应坐标
            300px - 50px - publicVar.pointXZero(x坐标原点位置)
            坐标对应上了后, 这就是rect元素的 X 值

        开启 document.onmosuemove, document.onmouseup 事件
        move 时, 获取当前鼠标位置
            假设当前位置为 500px
            同样, 转为坐标系, 500px - 50px - publicVar.pointXZero(x坐标原点位置)
            那么此时将得到 两个坐标, 有了这两个坐标, 就可以求出 坐标之间的距离, 就是宽度 --- width
            两种情况:  (为什么有两种情况, 因为正常情况下, 鼠标向右移动, 比按下点的位置会更大, 那么宽度计算就是 移动点 - 按下点, 反之亦然)
                1. 移动的坐标 比 鼠标按下时的坐标大

                    插曲: virtualSvg.setAttribute('x', curX) 这一行必须有!!! 因为在两种情况不停地切换的瞬间, 屏幕的刷频率
                    小于鼠标移动速度, 导致监测不到正确值

                    正文: 这行代码什么意思? -- (newX - curX)
                        Math.abs((newX + publicVar.pointXZero) - (curX + publicVar.pointXZero)) 这是它的上一版本
                        如果要追溯历史, 那么还有4,5个版本, 而(newX - curX)
                        是最精简的, 可读性最强, 最好维护的一个版本

                        先前说了, 我们有鼠标按下的坐标, 移动的坐标, 我都将其转为了 SVG坐标系
                        坐标系 以 原点为分界线, 左侧为负, 右侧为正, 这个放到SVG中, 正好对应 x, y等属性
                        但是要求宽度, 高度, 就不能这么做
                            假设我们得到一组坐标, 移动的x坐标转换后结果为 345, 按下的坐标为 10
                            那这个宽度比较好求, 345 - 10 = 335 width
                            那现在按下坐标变了呢
                                移动的x坐标转换后结果为 345, 按下的坐标为 -20
                                宽度计算 345 - (-20) = 365
                                移动的x坐标转换后结果为 -20, 按下的坐标为 -140
                                套上面公式 : 移动坐标 - 按下坐标
                                            (-20) - (-140) = 120
                            看下列场景:
                                按下坐标 在鼠标按下一瞬间就不会变了, 所以给常量 设curX = (-140)
                                这时候可以拖拽, 意味着 newX坐标 不是固定值
                                记得上面几个例子吗
                                    现在 鼠标从 -30 坐标 走到了 0 坐标, 也就是说总宽度为 30
                                    用上面公式 : 0 - -30 = 30,
                            至此: 公式已经正式成立

                2. 移动的坐标 比 鼠标按下时的坐标小 不演算了, 与上面差不多, 改了公式顺序而已

    <<<<<< move函数 和 up函数, 已经出现多次重复定义, 需要提取 >>>>>>

---------------------------------------------------------------------------------------------
    画笔功能 实现思路:
        首先要知道, 用哪个元素?
            能够进行线的绘制的就那么几种,
                path 太强大, 留到后面用
                line 绘制单条线段
                polyline 绘制连续线段, 只需要给定坐标点 √

        利用先前获取到的按下点坐标, 开启document事件监听
            mousemove & mouseup
                mousemove ↓↓↓↓↓↓↓↓↓
                    根据第一个生成矩形框来实现可视化选中元素就已经有了这么一个概念
                    坐标轴转换, 将当前偏移值转换为对应坐标系
                    最后赋值, 插入,功能就实现了

                mouseup   ↓↓↓↓↓↓↓↓↓
                    处理解绑

---------------------------------------------------------------------------------------------
    线段绘制 实现思路:
        与画笔功能及其相似, 换个元素就可以简单实现

---------------------------------------------------------------------------------------------
    矩形框绘制 实现思路:
        与第一个几乎完全一致

---------------------------------------------------------------------------------------------
    圆的绘制 实现思路:
        svg 我已知提供了两种原生绘制圆形的方法
            1. circle   正圆 cx cy r        3个值分别代表 圆心点坐标和半径
            2. ellipse  椭圆 cx cy rx ry    4个值分别代表 圆心坐标和水平半径和垂直半径
        定义需求:
            默认应该画什么?
                椭圆
            当按下 ctrl + shift 时
                绘制正圆, 并且圆心坐标为鼠标按下点, 圆心半径为鼠标按下点到移动点的距离 -- 勾股定理 a² + b² = c²
            当按下 shift 时
                ...后续添加
        如何确定圆心坐标和宽高,
            其实也是通过前面几种方式的变换, 画矩形确定宽高, 反方向拖拽也好, 正方形拖拽也好, 中心点坐标其实已经存在了
                代码迭代过程: 意会即可, 实际黏贴运行可能出现问题, 因为上下文环境可能已经发生变化
                    1代:
                        if (newX > curX) {
                            ellipse.setAttribute('rx', newX - curX)
                        } else {
                            ellipse.setAttribute('rx', curX - newX)
                        }
                    2代: 加入键盘事件条件判断
                        if (newX > curX) {
                            if(!ctrl && !shift && !alt){
                                ellipse.setAttribute('cx', (newX - curX) / 2)
                                ellipse.setAttribute('rx', (newX - curX) / 2)
                            }
                        } else {
                            if(!ctrl && !shift && !alt){
                                ellipse.setAttribute('cx', (curX - newX) / 2)
                                ellipse.setAttribute('rx', (curX - newX) / 2)
                            }
                            ellipse.setAttribute('rx', (curX - newX) / 2)
                        }
                    3代:
                        if (!ctrl && !shift && !alt) {
                            cx = Math.abs(newX) - Math.abs(curX)
                            // console.log(cx)
                            ellipse.setAttribute('cx', curX + cx / 2)
                            ellipse.setAttribute('rx', Math.abs(cx / 2))
                        }
                        优化分支语句, 除去 if(newX > curX) ... else ...
                        因为这两行代码不同采用了分支语句, 所以优化: (newX - curX) (curX - newX)
                            优化结果: cx = Math.abs(newX) - Math.abs(curX), 省去分支
            第一种情况, 默认画的椭圆, x点坐标应该是 按下的x坐标 + 实际 cx / 2 ---   curX + cx / 2, y同理
            第二种情况, 默认画的椭圆, x点坐标更改为 鼠标当前移动点坐标, y同理
            第三种情况, 画的为正圆, 且圆心坐标为按下点坐标到移动点坐标的中间值, 意味着cx, cy值需要同一值
            第四中情况, 画的为正圆, 且圆心坐标为按下点坐标, cx, cy 各扩大两倍

---------------------------------------------------------------------------------------------
    文本绘制 实现思路:
        在svg中文字绘制采用text元素, x y分别代表文字的显示横纵位置, 需要注意的是
        y值需要特殊对待, 因为文字是底边与y值对齐
            生成input框或者采用其他标签, 利用h5的contenteditable 来让其可编辑
                input 无法显示换行 弃
                p or textarea
                textarea 高度值不好计算
                最后采用 p

            需要解决的问题:
                svg文本能力较弱, 不支持多行, 怎么处理
                    - text 标签需要另一个标签的包裹 g
                    - 采用多个text标签 意味着需要正则匹配回车, 截取成数组, 对数组进行遍历, 然后生成text, x不变 y*n
                p标签无限回车,导致超出内容区, 如何优雅处理,
                p应该插入哪里, 才更方便操作

---------------------------------------------------------------------------------------------
    path 复杂路径绘制 实现思路:
        基于线段, 超级版本
        1. 元素选择 -- path, 因为后面可能会加入贝塞尔曲线, 所以不能用polyline
        2. 事件监听
            鼠标按下 -- 鼠标移动 -- 鼠标抬起

            鼠标按下
                画布区的原点击事件触发, 获取坐标点, 生成虚拟path, 
                因为path的d属性比较复杂, 操作字符比较麻烦, 而且不直观, 所以采用数组,
                每一项中存入一个对象, 管理当前对应的操作 M L Z等
                在该对象中又有一个对象记录当前操作符的信息, 比方说x, y坐标
                M : {
                    x: xxx,
                    y: xxx
                }
                初始化path后, 在进行第二个虚拟rect的生成, 这个矩形框主要是为了点击来做判定, 你路径在哪里结束

            鼠标移动
                d = "M xx xx L xx xx"
                移动时, 改变的就是最后一个属性值, 这也是前面利用数组来存储的原因
                对数组进行遍历, 找到需要操作的属性值, 对齐进行更改, 不需要操作的值
                直接赋给 d
                d += `${key} ${dArr[i][key].x} ${dArr[i][key].y}
                再将d 属性重新赋值给虚拟path

                这就实现了可视化折线的动态绘制

            鼠标点击
                1. 重载整个画布区的点击事件, 改为path专用的处理函数
                2. 判断当前是否点击到了标记方块
                    2.1 否 -- 生成新的 L 属性, 加入 dArr 数组中, 改变下一次移动要操作的索引
                        以及再次生成标记点
                    2.2 是
                        2.2.1 解绑事件, 重新注册画布原点击事件
                        2.2.2 生成真正的path, 计算属性值, 插入节点
                        2.2.3 移除所有虚拟节点                        
                3. 点击到了画布区域以外的地方
                    执行2.2 操作 

---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------
*/