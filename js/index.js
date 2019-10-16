// 导航菜单， 点击出子项
(function () {
    let list = [...document.querySelectorAll('header nav .list')],
        // 上一个被选中的list
        lastList = null,
        // 当点击一个列表项后, 鼠标直接移入其他列表项即可触发下拉菜单
        lock = false

    list.forEach(item => {
        item.addEventListener('mousedown', toggleClass)
        item.addEventListener('mouseenter', function (e) {
            // 移入列表项, 只有在没有selected 类名的时候 才能再次进行切换
            if (lock && !e.target.classList.contains('selected')) {
                toggleClass.call(this, e)
            }
            e.stopPropagation()
            e.preventDefault()
        })
    })

    function toggleClass(e) {
        // 上一个被选中的itembox
        let itemBox = this.getElementsByClassName('item-box')[0]
        classList = itemBox.classList

        // 在点击下一个元素前先将上一个元素样式清除
        if (lastList !== null && lastList !== this) {
            lastList.classList
                .remove('selected')

            lastList.getElementsByClassName('item-box')[0]
                .classList
                .replace('show', 'hide')
        }

        // 如果上一个和当前点击元素相等，并且当前元素需要隐藏 那么也应该禁用鼠标移入事件
        if (lastList === this && !classList.contains('hide')) {
            lock = false
        } else {
            lock = true
        }
        // 重新记录上一个被选中元素
        lastList = this

        // 是否隐藏
        if (classList.contains('hide')) {

            classList.remove('hide')
            classList.add('show')
            this.classList.add('selected')

        } else {

            classList.remove('show')
            classList.add('hide')

            this.classList.remove('selected')
        }


        // e.stopPropagation && e.stopPropagation()

    }

    document.addEventListener('mousedown', function (e) {
        // 重新更改函数， 解决事件冒泡问题
        let arr
        arr = Tool.getParentEl(e.target)

        if (arr.find(item => item.nodeName === 'HEADER')) {
            return
        }

        if (lastList !== null) {
            lastList.classList
                .remove('selected')

            lastList.getElementsByClassName('item-box')[0]
                .classList
                .replace('show', 'hide')
        }
        lastList = null
        lock = false
    })
})();

// 坐标轴
(function ({ pointXZero, pointYZero }) {
    /*
        待完善.................

        获取 canvas 左侧距离为横坐标0点
        根据当前0点, 向两侧每隔50个坐标点生成left值
        -50 0 50 100 150 
    */
    let core = document.getElementsByClassName('core')[0],
        // 元素身上没有 getElementBtId 方法
        gaugeX = document.getElementById('gauge-x'),
        gaugeY = document.getElementById('gauge-y'),
        coreCanvas = document.getElementById('canvas'),
        // 获取两轴 绘图上下文环境
        gaugeXCtx = gaugeX.getContext('2d'),
        gaugeYCtx = gaugeY.getContext('2d'),
        // x轴
        gaugeXH = gaugeX.height = 15,
        gaugeXW = gaugeX.width = core.offsetWidth,
        // y轴
        gaugeYH = gaugeY.height = core.offsetHeight,
        gaugeYW = gaugeY.width = 15
    // 计算X原点坐标
    publicVar.pointXZero = pointXZero = coreCanvas.offsetLeft - Math.round(coreCanvas.offsetWidth / 2)
    // 计算Y原点坐标
    publicVar.pointYZero = pointYZero = coreCanvas.offsetTop - Math.round(coreCanvas.offsetHeight / 2)

    //  canvas 暂定宽高

    // 设置宽高
    publicVar.reset = function () {
        // 重定宽高
        gaugeXW = gaugeX.width = core.offsetWidth
        gaugeYH = gaugeY.height = core.offsetHeight
        // 计算X原点坐标
        publicVar.pointXZero = pointXZero = coreCanvas.offsetLeft - Math.round(coreCanvas.offsetWidth / 2)
        // 计算Y原点坐标
        publicVar.pointYZero = pointYZero = coreCanvas.offsetTop - Math.round(coreCanvas.offsetHeight / 2)
        // 绘制坐标系
        draw()
    }

    publicVar.reset()
    window.onresize = () => {
        publicVar.reset()
    }


    function draw() {

        gaugeXCtx.clearRect(0, 0, gaugeXW, gaugeXH)
        gaugeYCtx.clearRect(0, 0, gaugeYW, gaugeYH)

        for (let i = 0; i < 50; i++) {

            gaugeXCtx.beginPath()
            gaugeYCtx.beginPath()

            if (i === 0) {
                gaugeXCtx.fillStyle = gaugeXCtx.strokeStyle = 'rgb(0, 222, 204)'
                gaugeYCtx.fillStyle = gaugeYCtx.strokeStyle = 'rgb(0, 222, 204)'
            } else {
                gaugeXCtx.fillStyle = gaugeXCtx.strokeStyle = 'rgb(156, 156, 156)'
                gaugeYCtx.fillStyle = gaugeYCtx.strokeStyle = 'rgb(156, 156, 156)'
            }
            // 
            gaugeYCtx.lineWidth = gaugeXCtx.lineWidth = 0.5
            // 线宽0.5 模糊解决 pointXZero + i * 50 - (0.5)
            // 原点向右
            // 0 50 100 150

            gaugeXCtx.moveTo(pointXZero + i * 50 - 0.5, 0)
            gaugeXCtx.lineTo(pointXZero + i * 50 - 0.5, gaugeXH)

            gaugeYCtx.moveTo(0, pointYZero + i * 50 - 0.5)
            gaugeYCtx.lineTo(gaugeYW, pointYZero + i * 50 - 0.5)

            // Y 
            gaugeYCtx.moveTo(gaugeYW * 0.8, pointYZero + i * 50 + 10 - 0, 5)
            gaugeYCtx.lineTo(gaugeYW, pointYZero + i * 50 + 10 - 0.5)

            gaugeYCtx.moveTo(gaugeYW * 0.65, pointYZero + i * 50 + 20 - 0, 5)
            gaugeYCtx.lineTo(gaugeYW, pointYZero + i * 50 + 20 - 0.5)

            gaugeYCtx.moveTo(gaugeYW * 0.8, pointYZero + i * 50 + 30) - 0, 5
            gaugeYCtx.lineTo(gaugeYW, pointYZero + i * 50 + 30 - 0.5)

            gaugeYCtx.moveTo(gaugeYW * 0.65, pointYZero + i * 50 + 40 - 0, 5)
            gaugeYCtx.lineTo(gaugeYW, pointYZero + i * 50 + 40 - 0.5)
            // Y

            // X
            gaugeXCtx.moveTo(pointXZero + i * 50 - 0.5 + 10, gaugeXH * 0.8)
            gaugeXCtx.lineTo(pointXZero + i * 50 - 0.5 + 10, gaugeXH)

            gaugeXCtx.moveTo(pointXZero + i * 50 - 0.5 + 20, gaugeXH * 0.65)
            gaugeXCtx.lineTo(pointXZero + i * 50 - 0.5 + 20, gaugeXH)

            gaugeXCtx.moveTo(pointXZero + i * 50 - 0.5 + 30, gaugeXH * 0.8)
            gaugeXCtx.lineTo(pointXZero + i * 50 - 0.5 + 30, gaugeXH)

            gaugeXCtx.moveTo(pointXZero + i * 50 - 0.5 + 40, gaugeXH * 0.65)
            gaugeXCtx.lineTo(pointXZero + i * 50 - 0.5 + 40, gaugeXH)
            // X

            gaugeYCtx.font = gaugeXCtx.font = '9px 微软雅黑'
            gaugeXCtx.fillText(i * 50, pointXZero + i * 50 + 2, 9)

            let n1 = String(i * 50).split('')
            n1.forEach((item, index) => {
                gaugeYCtx.fillText(item, 3, pointYZero + i * 50 + 9 * (index + 1))
            })

            // 原点向左
            gaugeXCtx.moveTo(pointXZero - i * 50 - 0.5, 0)
            gaugeXCtx.lineTo(pointXZero - i * 50 - 0.5, gaugeXH)

            // Y
            gaugeYCtx.moveTo(gaugeYW * 0.8, pointYZero - i * 50 - 10 - 0.5)
            gaugeYCtx.lineTo(gaugeYW, pointYZero - i * 50 - 10 - 0.5)

            gaugeYCtx.moveTo(gaugeYW * 0.65, pointYZero - i * 50 - 20 - 0.5)
            gaugeYCtx.lineTo(gaugeYW, pointYZero - i * 50 - 20 - 0.5)

            gaugeYCtx.moveTo(gaugeYW * 0.8, pointYZero - i * 50 - 30) - 0.5
            gaugeYCtx.lineTo(gaugeYW, pointYZero - i * 50 - 30 - 0.5)

            gaugeYCtx.moveTo(gaugeYW * 0.65, pointYZero - i * 50 - 40 - 0.5)
            gaugeYCtx.lineTo(gaugeYW, pointYZero - i * 50 - 40 - 0.5)
            // Y

            // X
            gaugeXCtx.moveTo(pointXZero - i * 50 - 0.5 - 10, gaugeXH * 0.8)
            gaugeXCtx.lineTo(pointXZero - i * 50 - 0.5 - 10, gaugeXH)

            gaugeXCtx.moveTo(pointXZero - i * 50 - 0.5 - 20, gaugeXH * 0.65)
            gaugeXCtx.lineTo(pointXZero - i * 50 - 0.5 - 20, gaugeXH)

            gaugeXCtx.moveTo(pointXZero - i * 50 - 0.5 - 30, gaugeXH * 0.8)
            gaugeXCtx.lineTo(pointXZero - i * 50 - 0.5 - 30, gaugeXH)

            gaugeXCtx.moveTo(pointXZero - i * 50 - 0.5 - 40, gaugeXH * 0.65)
            gaugeXCtx.lineTo(pointXZero - i * 50 - 0.5 - 40, gaugeXH)
            // X

            gaugeXCtx.fillText(-i * 50, pointXZero - i * 50 + 2, 9)

            let n2 = String(-i * 50).split('')
            n2.forEach((item, index) => {
                gaugeYCtx.fillText(item, 3, pointYZero - i * 50 + 9 * (index + 1))
            })


            // 绘制
            gaugeXCtx.stroke()
            gaugeYCtx.stroke()

        }
    }
})(publicVar);

// 鼠标移动获取坐标点,更改视图
(function ({ isChangeRightBar: iCRB } = {}) {
    let core = document.querySelector('.core'),
        cursorPoint = document.querySelector('.cursor-point'),
        lineX = document.querySelector('.auxiliary-line .lineX'),
        lineY = document.querySelector('.auxiliary-line .lineY')

    window.addEventListener('resize', () => {
        // 定义默认值
        lineX.style.top = publicVar.pointYZero + 'px'
        lineY.style.left = publicVar.pointXZero + 'px'
    })

    // 为什么给document 绑定, 因为鼠标移速可能过快, 屏幕刷新频率跟不上, 得出错误的结果, !!!!此处开发遇到瓶颈
    // document.addEventListener('mousemove', getPosition)
    core.addEventListener('mousemove', getPosition)

    // 希望这个函数只有在鼠标移动到指定位置时才会触发
    function getPosition(e) {
        // 为true时不应执行此函数
        if (iCRB) {
            return
        }
        // console.log(this.)
        // console.log(e.offsetX), e.offsetY
        // offset 系列特点, 计算偏移结果会根据事件源的不同有所偏差, 所以改为client
        let client = {
            x: e.clientX,
            y: e.clientY
        }

        changePoint(client)

        // 检测配置是否开启
        if (config.openAuxiliaryLine) {
            changeLine(client)
        }

        // 事件冒泡不能阻止....
        // e.stopPropagation && e.stopPropagation()
    }

    // 改变底部坐标信息
    function changePoint({ x, y } = {}) {
        // 实际值, 应该再次处理, 计算公式: X: x - 左侧边栏宽 - publicVar.pointXZero, y同理
        cursorPoint.children[0].innerText = `X: ${x - 50 - publicVar.pointXZero} Y: ${y - 35 - publicVar.pointYZero}`
    }

    // 改变辅助线位置
    function changeLine({ x, y }) {
        /*
            公式计算:
                x: 鼠标距离屏幕左侧距离 - 左侧边栏距离
                y: ...同理
        */

        // 35 
        lineX.style.top = y - 35 + 'px';
        lineY.style.left = x - 50 + 'px';
    }
})(publicVar);

// 右侧详情, 拖拽改变宽度, 宽度拥有临界值, 小于一定临界值, 将收起
(function () {
    let objDetails = document.querySelector('.obj-details'),
        movePosi = objDetails.querySelector('.move-posi'),
        detailVar = {
            // 容器宽度
            detailWidth: objDetails.clientWidth,
            // 鼠标按下位置信息
            mousedownX: 0,
            // 鼠标抬起位置信息
            mouseupX: 0,
            // 标记是否需要添加类名
            isHide: false,
            // 是否在进行过渡
            isTransition: false
        }

    objDetails.addEventListener('transitionend', () => {
        // 过渡完后再添加类名, 不是任何情况下都需要添加 这个类名
        if (detailVar.isHide) {
            objDetails.classList.add('hide')
        }
        // 触发画布宽度调整
        publicVar.reset()

        // 过渡属性回归初始化
        objDetails.style.transition = 'none'

        // 过渡结束
        detailVar.isTransition = false
    })


    movePosi.addEventListener('mousedown', down, false)

    function down(e) {

        // 当这个元素是隐藏状态时, 再次点击, 应该回到初始化180px
        if (objDetails.classList.contains('hide')) {
            // 开始过渡, 禁止移动 
            detailVar.isTransition = true

            objDetails.classList.remove('hide')
            // 拒绝添加hide类名
            detailVar.isHide = false
            // 重新变更宽度信息
            // 180的宽 + 左右各10px padding
            detailVar.detailWidth = 200
            objDetails.style.transition = 'width .3s'
            objDetails.style.width = '180px'
            // objDetails.style.transition = 'all .3s'

            return
        }

        // 准备拖拽
        publicVar.isChangeRightBar = true
        document.body.style.cursor = 'ew-resize'

        detailVar.mousedownX = e.clientX

        document.addEventListener('mousemove', move, false)
        document.addEventListener('mouseup', unBind, false)

    }

    function move(e) {

        // 检测当前是否在正在执行过渡动画
        if (detailVar.isTransition) {
            return
        }

        let newX = e.clientX,
            changeW = detailVar.mousedownX - newX
        // 更改宽度 
        // detailVar.detailWidth = detailVar.detailWidth + changeW
        // 计算公式: oldX - newX = 需要更改的宽度信息, 值为正, 宽度增加, 反之减小
        objDetails.style.width = detailVar.detailWidth + changeW + 'px'

        // 触发画布宽度调整
        publicVar.reset()

        e.stopPropagation && e.stopPropagation()
    }

    // 解绑函数
    function unBind() {
        // 拖拽结束
        publicVar.isChangeRightBar = false
        document.body.style.cursor = 'default'
        // 重新变更宽度信息
        detailVar.detailWidth = objDetails.clientWidth

        document.removeEventListener('mousemove', move, false)
        document.removeEventListener('mouseup', unBind, false)

        // 如果宽度小于100px, 将右侧收起
        if (detailVar.detailWidth < 100) {
            // 开始过渡, 禁止移动 
            detailVar.isTransition = true

            // 确定添加hide类名
            detailVar.isHide = true

            // 重新变更宽度信息
            detailVar.detailWidth = 0
            objDetails.style.width = '0px'
            // 注意此处 all 属性, 有大坑
            objDetails.style.transition = 'width .3s'
            // objDetails.style.transition = 'all .3s'
        }
    }
})();

// 可拖拽悬浮窗口 已实现，后续小问题：根据窗口变化，该实例应作出响应(完成)
// -------已通过dragable.js 实现

// 主内容左侧功能栏 状态切换
(function () {
    let asideItem = [...document.querySelectorAll('.aside-left > .item')],
        // 更改鼠标样式
        core = document.querySelector('main > .canvas-wrap .core'),
        // 上一个选中元素, (第一个为默认选中) 
        lastIndex = 0,
        // 上一个状态
        lastStatus = asideItem[lastIndex].getAttribute('data-status')

    asideItem.forEach((item, index) => {
        item.addEventListener('mousedown', function (e) {
            toggleStatus.call(this, e, index)
        }, false)
    })

    function toggleStatus(e, index) {
        let lastItem = asideItem[lastIndex],
            nowStatus = this.getAttribute('data-status')

        // 小处理, 如果点的元素是同一个, 那么不执行多余操作
        if (this === lastItem) {
            // ... do something
            return
        }

        // 去除上一个类名
        lastItem.classList.remove('selected')
        // 当前元素添加
        this.classList.add('selected')

        // 更改全局配置文件信息
        config.CanvasStatus = nowStatus

        // 老规矩, 替换信息
        lastIndex = index
        lastStatus = nowStatus

        // 鼠标样式
        if (lastStatus === 'Line') {
            core.style.cursor = 'crosshair'
        } else if (lastStatus === 'Text') {
            core.style.cursor = 'text'
        } else if (lastStatus === 'Pencil') {
            // 暂定
            core.style.cursor = 'crosshair'
        } else {
            core.style.cursor = 'default'
        }
    }

    // 键盘事件, 快捷键设置
    document.onkeydown = function (e) {
        switch (e.code) {
            case 'KeyV':
                toggleStatus.call(asideItem[0], null, 0)
                break
            case 'KeyQ':
                toggleStatus.call(asideItem[1], null, 1)
                break
            case 'KeyL':
                toggleStatus.call(asideItem[2], null, 2)
                break
            case 'KeyS':
                toggleStatus.call(asideItem[3], null, 3)
                break
            case 'KeyC':
                toggleStatus.call(asideItem[4], null, 4)
                break
            case 'KeyP':
                toggleStatus.call(asideItem[5], null, 5)
                break
            case 'KeyG':
                toggleStatus.call(asideItem[6], null, 6)
                break
            case 'KeyT':
                toggleStatus.call(asideItem[7], null, 7)
                break
            case 'KeyD':
                toggleStatus.call(asideItem[8], null, 8)
                break
        }

        // e.preventDefault()
    }
})();

// 对svg实行DOM tree监听
(function () {
    /*
template: 
    <div class="item">
        <div class="preview"></div>
        <div class="des"><p>RECT</p></div>
        <div class="clock">
            <i class="iconfont icon-xuanzegongju"></i>
        </div>
    </div>
*/
    let svg = document.querySelector('#canvas svg'),
        // 需要插入元素
        list = document.querySelector('main .picture-layer .list'),
        observer = new MutationObserver(function (mutationList) {
            let addedNodes = mutationList[0].addedNodes,
                firstNode,
                firstNodeName

            if (addedNodes.length > 0) { // 添加节点的操作
                // 因为有些元素在创建完后就销毁了， 所以会触发两次该函数监听 mutationList[0].removedNodes
                firstNode = addedNodes[0],
                    firstNodeName = firstNode.nodeName
                // 并不是所有的元素都需要插入, 一些内置的元素不需要插入, 用完即扔
                if ([...firstNode.classList].join(' ').includes('system-')) { return }

                // 没有子节点
                if (list.childElementCount === 0) {
                    list.appendChild(createDom({
                        nodeName: firstNodeName,
                        rel: firstNode
                    }))
                } else {
                    // 后面创建的元素层级应该是高于前者
                    list.insertBefore(createDom({
                        nodeName: firstNodeName,
                        rel: firstNode
                    }), list.children[0])
                }
                // 元素已经被插入, 执行相应操作
                insertAfter({
                    nodeName: firstNodeName,
                    rel: firstNode
                })
            }

        })

    function createDom({ nodeName, rel } = {
        nodeName: '匿名元素',
        rel: Tool.createSvgEl('rect')
    }) {

        let clock,
            item = document.createElement('div'),
            preview = item.cloneNode(),
            svg = Tool.createSvgEl('svg'),
            html = `<div class="des"><p>${nodeName}</p></div>
        <div class="clock" title="delete">
            <i class="iconfont icon-iconset0212"></i>
        </div>`

        svg.setAttribute('width', 30)
        svg.setAttribute('height', 30)
        svg.setAttribute('viewBox', '0, 0, 750, 375')
        // 插入节点
        svg.appendChild(rel.cloneNode(true))
        preview.appendChild(svg)
        item.appendChild(preview)

        preview.classList.add('preview')
        item.classList.add('item')
        item.innerHTML += html
        // 自定义属性, 挂载svg元素引用 
        item.svgRel = rel

        // 截取dom
        clock = item.getElementsByClassName('clock')[0]

        // 注册事件处理函数
        bindEvent(item, clock)

        return item
    }
    // 遇到bug, 不知原因            原因已查明
    function bindEvent(item, clock) {
        let svgRel, cloneItem

        function enter() {
            // 先保存一份当前对象引用
            cloneItem = this
            svgRel = this.svgRel
            if (svgRel.nodeName === 'polyline') {
                svgRel.classList.add('active-stroke')
            } else {
                svgRel.classList.add('active-fill')
            }
        }

        function leave() {
            if (svgRel.nodeName === 'polyline') {
                svgRel.classList.remove('active-stroke')
            } else {
                svgRel.classList.remove('active-fill')
            }
        }

        function down(e) {
            svgRel.remove()
            // 闭包
            cloneItem.remove()

            e.stopPropagation()
        }

        // 鼠标移入移出
        item.addEventListener('mouseenter', enter, false)
        item.addEventListener('mouseleave', leave, false)
        // 点击事件
        item.addEventListener('mousedown', function () {
            // new SvgDetails(svgRel)
            // window.a = new SVGLineElementL(svgRel)
        })
        // 点击事件
        // item.addEventListener('mousedown', , false)

        // 点击删除
        clock.addEventListener('mousedown', down, false)
    }

    // 开启监听
    observer.observe(svg, {
        childList: true
    })

    function insertAfter({ nodeName, rel }) {
        // nodeName -- 元素名， rel -- 元素引用（元素实例）
        console.log(rel)
        switch (nodeName) {
            case 'line':
                new SVGLineElementL(rel)
                break;
            case 'rect':
                break;
            case 'image':
                break;
            case 'polyline':
                break;
            case 'path':
                break;
            case 'ellipse':
                break;
            case 'g':
                break;
        }

    }

})();


