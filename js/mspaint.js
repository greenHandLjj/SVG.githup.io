/**
 * 绘图相关核心代码
 *      一切源于 click ...
 * 
 * 
 */

class Mspaint {
    constructor({el} = {}) {
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
                curY
            })
        })
    }

    // Select (选择)
    Select({curX, curY} = {}) {
        let move, up, 
            self = this,
            virtualSvg = Tool.createSvgEl('rect')
        
        virtualSvg.setAttribute('x', curX)
        virtualSvg.setAttribute('y', curY)
        virtualSvg.setAttribute('class', 'system-rect')

        publicVar.canvas.appendChild(virtualSvg)

        move = function(e) {
            // 转为 SVG 坐标系
            let newX = e.clientX - self.elOffsetX - publicVar.pointXZero,
                newY = e.clientY - self.elOffsetY - publicVar.pointYZero
        
            // 具体思路, 请滑至底部
            if(newX > curX){
                // console.log(curX, newX)
                virtualSvg.setAttribute('x', curX)
                // console.log( "x: " + curX, 
                //             "width: "+ Math.abs((newX + publicVar.pointXZero) - (curX + publicVar.pointXZero))
                // )
                // (newX + publicVar.pointXZero) - (curX + publicVar.pointXZero)

                virtualSvg.setAttribute('width', newX - curX)
            }else{
                virtualSvg.setAttribute('x', newX)
                virtualSvg.setAttribute('width', curX - newX)
            }

            if(newY > curY){
                virtualSvg.setAttribute('y', curY)
                virtualSvg.setAttribute('height', newY- curY)
            }else{
                virtualSvg.setAttribute('y', newY)
                virtualSvg.setAttribute('height', curY - newY)
            }

        }

        up = function(e) {
            // 解绑事件
            document.removeEventListener('mousemove', move, false)
            document.removeEventListener('mouseup', up, false)

            virtualSvg.remove()
        }

        document.addEventListener('mousemove', move, false)
        document.addEventListener('mouseup', up, false)
    }

    // Pencil (画笔)
    Pencil() {

    }

    // Line (线段)
    Line() {

    }

    // Square (方形)
    Square() {

    }

    // Circle (圆)
    Circle() {

    }

    // Path (多路径绘制)
    Path() {

    }

    // Geometry (几何绘制)
    Geometry() {

    }

    // Text (文本)
    Text() {

    }

    // Dropper (吸管)
    Dropper() {

    }

}

new Mspaint({
    el: '.core'
})


/*
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



*/