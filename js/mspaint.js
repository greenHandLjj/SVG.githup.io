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

            this.bindEvent(this.el)

        }

        // 绑定事件
        bindEvent(dom) {
            // 说了, 一切源于 click
            dom.addEventListener('mousedown', (e) => {
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
            })
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
                isMove ++
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
                if(isMove === 1){
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
                polyline = Tool.createSvgEl('polyline'),
                points = `${curX} ${curY}` // 起点

            polyline.setAttribute('points', points)
            polyline.setAttribute('stroke', '#000')
            polyline.setAttribute('fill', 'none')

            move = function (e) {
                // 转为 SVG 坐标系
                let newX = e.clientX - self.elOffsetX - publicVar.pointXZero,
                    newY = e.clientY - self.elOffsetY - publicVar.pointYZero

                isMove ++
                points = polyline.getAttribute('points')
                points += `, ${newX} ${newY}`
                polyline.setAttribute('points', points)

                if(isMove === 1){
                    // 插入节点
                    publicVar.canvas.appendChild(polyline)
                }
            }

            up = function (e) {
                document.removeEventListener('mousemove', move, false)
                document.removeEventListener('mouseup', up, false)
            }

            document.addEventListener('mousemove', move, false)
            document.addEventListener('mouseup', up, false)
        }

        // Line (线段)
        Line({ curX, curY } = {}) {
            let move, up,
                self = this,
                isMove = 0,
                line = Tool.createSvgEl('line')

            line.setAttribute('x1', curX)
            line.setAttribute('y1', curY)
            // 默认都是当前点, 防止取默认值, 0, 0
            line.setAttribute('x2', curX)
            line.setAttribute('y2', curY)
            line.setAttribute('stroke', '#000')

            move = function (e) {
                // 转为 SVG 坐标系
                let newX = e.clientX - self.elOffsetX - publicVar.pointXZero,
                    newY = e.clientY - self.elOffsetY - publicVar.pointYZero
                isMove ++
                line.setAttribute('x2', newX)
                line.setAttribute('y2', newY)

                if(isMove === 1){
                    // 插入节点
                    publicVar.canvas.appendChild(line)
                }
            }

            up = function (e) {
                document.removeEventListener('mousemove', move, false)
                document.removeEventListener('mouseup', up, false)
            }

            document.addEventListener('mousemove', move, false)
            document.addEventListener('mouseup', up, false)

        }

        // Square (方形)
        Square({ curX, curY } = {}) {
            let move, up,
                self = this,
                isMove = 0,
                rect = Tool.createSvgEl('rect')

            rect.setAttribute('x', curX)
            rect.setAttribute('y', curY)
            // 默认不填充, 后面需要填充变量
            rect.setAttribute('fill', 'rgba(0, 0, 0, 0)')
            rect.setAttribute('stroke', '#000')

            move = function (e) {
                // 转为 SVG 坐标系
                let newX = e.clientX - self.elOffsetX - publicVar.pointXZero,
                    newY = e.clientY - self.elOffsetY - publicVar.pointYZero

                isMove ++
                // 具体思路, 请滑至底部
                if (newX > curX) {
                    // console.log(curX, newX)
                    rect.setAttribute('x', curX)
                    // console.log( "x: " + curX, 
                    //             "width: "+ Math.abs((newX + publicVar.pointXZero) - (curX + publicVar.pointXZero))
                    // )
                    // (newX + publicVar.pointXZero) - (curX + publicVar.pointXZero)

                    rect.setAttribute('width', newX - curX)
                } else {
                    rect.setAttribute('x', newX)
                    rect.setAttribute('width', curX - newX)
                }

                if (newY > curY) {
                    rect.setAttribute('y', curY)
                    rect.setAttribute('height', newY - curY)
                } else {
                    rect.setAttribute('y', newY)
                    rect.setAttribute('height', curY - newY)
                }

                if(isMove === 1){
                    // 插入节点
                    publicVar.canvas.appendChild(rect)
                }

            }

            up = function (e) {
                document.removeEventListener('mousemove', move, false)
                document.removeEventListener('mouseup', up, false)
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
                ellipse = Tool.createSvgEl('ellipse')
            // ellipse  cx cy rx ry
            // circle   cx cy r
            ellipse.setAttribute('fill', 'none')
            ellipse.setAttribute('stroke', '#000')
            // ellipse.setAttribute('cx', curX)
            // ellipse.setAttribute('cy', curY)
            
            move = function (e) {
                // 转为 SVG 坐标系
                let newX = e.clientX - self.elOffsetX - publicVar.pointXZero,
                    newY = e.clientY - self.elOffsetY - publicVar.pointYZero,
                    cx, cy, rx, ry
                
                cx = Math.abs(newX) - Math.abs(curX)
                cy = Math.abs(newY) - Math.abs(curY)
                isMove ++

                if(shift){ // 只有画正圆的时候才会计算, 下面计算公式依据勾股定理
                    ry = rx = Math.sqrt( Math.pow((curX + cx / 2) - newX, 2) + Math.pow((curY + cy / 2) - newY, 2) )
                }

                // 键盘事件条件判断
                if ( (!ctrl && !shift && !alt) || ctrl ) { // 什么都没按
                    // console.log(cx)
                    ellipse.setAttribute('cx', curX + cx / 2)
                    ellipse.setAttribute('rx', Math.abs(cx / 2))

                    ellipse.setAttribute('cy', curY + cy / 2)
                    ellipse.setAttribute('ry', Math.abs(cy / 2))
                }else if(!ctrl && !shift && alt) { // 按下alt键, 圆心改为鼠标当前点
                    ellipse.setAttribute('cx', curX + cx)
                    ellipse.setAttribute('rx', Math.abs(cx))

                    ellipse.setAttribute('cy', curY + cy)
                    ellipse.setAttribute('ry', Math.abs(cy))
                }else if(!ctrl && shift && !alt) { // 按下shift键 画正圆, 以x轴为基准
                    // rx ry 保持一致, 求鼠标中心点坐标到移动点坐标的直线距离
                    ellipse.setAttribute('cx', curX + cx / 2)
                    ellipse.setAttribute('rx', rx)

                    ellipse.setAttribute('cy', curY + cy / 2)
                    ellipse.setAttribute('ry', ry)
                }else{ // 其余情况全部画正圆, 坐标点为按下点

                    ellipse.setAttribute('cx', curX)
                    // 为何扩大两倍？ 为了跟上鼠标位置
                    ellipse.setAttribute('rx', rx * 2)

                    ellipse.setAttribute('cy', curY)
                    ellipse.setAttribute('ry', ry * 2)
                }

                if(isMove === 1){
                    // 插入节点
                    publicVar.canvas.appendChild(ellipse)
                }

            }

            up = function (e) {
                document.removeEventListener('mousemove', move, false)
                document.removeEventListener('mouseup', up, false)
                document.removeEventListener('keydown', keyDown, false)
                document.removeEventListener('keyup', keyUp, false)
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

        // Path (多路径绘制)
        Path({ curX, curY } = {}) {

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
            if(document.querySelector('#svg-p') !== null){
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
            keydown = function(e) {
                // this.innerText                
                e.stopPropagation()
            }

            // 截取, 创建, 插入, 删除 
            textMousedown = function(e) {
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
---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------
*/