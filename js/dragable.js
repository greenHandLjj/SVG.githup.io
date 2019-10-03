/**
 *  拖拽功能封装
 *      暂定: DOM
 *      1. 点击目标元素
 *      2. 检测鼠标移动
 *      3. 鼠标抬起, 解绑事件
 *      4. 边界检测, 如果有传递边界元素, 那么拖拽范围将不可超过边界
 *      
 *      SVG 元素
 *          后续...
 * 
 */

class DomDrag {
    constructor ({el, boundary}) {
        this.el = Tool.selectedDom(el)

        // this.el.style.transition = 'left 0.05s linear, top 0.05s linear'

        // 元素宽高， 用于边界检测判定
        this.elW = this.el.offsetWidth
        this.elH = this.el.offsetHeight
        // 获取当前元素视觉可见的距离左，上边距
        ;({left: this.elL, top: this.elT} = this.el.getBoundingClientRect())

        // 边界元素, 如果传递false, 将不进行边界检测， 否则默认值相对于 window
        this.boundary = typeof boundary === "string" ? Tool.selectedDom(boundary) : window
        // 边界元素宽度， 同样用于边界检测
        if(this.boundary === window){
            this.boundaryW = window.innerWidth
            this.boundaryH = window.innerHeight

            // window的话就0， 获取该边界元素距离顶部和左边的距离
            this.boundaryT = 0
            this.boundaryL = 0

        }else if(this.boundary !== false){
            this.boundaryW = this.boundary.offsetWidth
            this.boundaryH = this.boundary.offsetHeight

            let offset = this.boundary.getBoundingClientRect()
            // 获取该边界元素距离顶部和左边的距离
            this.boundaryT = offset.top
            this.boundaryL = offset.left
        }

        this.move = e => {
            let el = this.el

            /*
                边界检测计算公式：
                    注意元素是相对于谁定位, 如果不是相对文档那么需要加上更多的参数来进行判断
                    比方说: 需要告知我你相对于哪个父级进行定位, 我需要知道这个父级的offsetLeft,和offsetTop
                    才能进行准确的判断

                    当前元素left + width <= 边界元素宽度 + 边界元素的左侧屏幕距离
                    当前元素left + width >= 边界元素的左侧屏幕距离

                    top 同理
            */
            let x = this.currentX + (e.clientX - this.downX)
            let y = this.currentY + (e.clientY - this.downY)

           if(this.boundary) {

                // 测试公式 x >= -50 && x + this.elW + 50 <= this.boundaryW
                // X 轴边界判定
                if(x < (-this.elL) + this.boundaryL) {
                    el.style.left = `${-this.elL + this.boundaryL}px`
                }else if(x + this.elW + this.elL > this.boundaryW + this.boundaryL) {
                    el.style.left = `${this.boundaryW + this.boundaryL - this.elL - this.elW}px`
                }else{
                    el.style.left = `${x}px`
                }

                // Y轴边界判定
                if(y < (-this.elT) + this.boundaryT) {
                    el.style.top = `${-this.elT + this.boundaryT}px`
                }else if(y + this.elH + this.elT > this.boundaryH + this.boundaryT) {
                    el.style.top = `${this.boundaryH + this.boundaryT - this.elT - this.elH}px`
                }else{
                    el.style.top = `${y}px`
                }
                
           }

            
        }
        this.up = () => {
            document.removeEventListener('mousemove', this.move, false)
            document.removeEventListener('mousemove', this.up, false)
        }

        this.el.addEventListener('mousedown', this.down.bind(this), false)

    }
    
    // 按下
    down(e) {
        let el = this.el
        // 记录按下坐标
        this.downX = e.clientX
        this.downY = e.clientY
        // 记录元素原本坐标
        this.currentX = parseInt( window.getComputedStyle(el, null).left )
        this.currentY = parseInt( window.getComputedStyle(el, null).top )

        document.addEventListener('mousemove', this.move, false)
        document.addEventListener('mouseup', this.up, false)

    }

    // 移动
    // move(e) {
    //     let el = this.el
    //     console.log('moveing')
    //     // el.style.left = this.currentX + (e.clientX - this.downX) + 'px'

    // }

    // // 抬起
    // up() {

    //     console.log('uping')
    //     // console.log(this.up)
    //     // 遇到问题， 事件无法解绑?????， this.move 也不是匿名函数啊
    //     document.removeEventListener('mousemove', this.move, false
    //     // document.removeEventListener('mouseup', this.up, false)

    // }
}

/* 
    导致事件无法解绑原因猜测：
        给该事件绑定的函数是位于原型链之上， 属于所有实例共有的函数，

            函数解绑机制究竟是怎么样的？
            将函数从内存中释放 ?
            还是将被绑定元素本身的某个事件属性 中的引用给置空 ?

*/