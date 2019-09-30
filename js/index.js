(function () {
    // 导航菜单， 点击出子项
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

        // 重新记录上一个被选中元素
        lastList = this
        lock = true

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

        e.stopPropagation && e.stopPropagation()

    }

    document.addEventListener('mousedown', function () {
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

(function () {

    // 坐标轴
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
        gaugeYW = gaugeY.width = 15,
        // 计算X原点坐标
        pointXZero = coreCanvas.offsetLeft - coreCanvas.offsetWidth / 2,
        // 计算Y原点坐标
        pointYZero = coreCanvas.offsetTop - coreCanvas.offsetHeight / 2

    //  canvas 暂定宽高

    // 设置宽高
    function reset() {
        // 重定宽高
        gaugeXW = gaugeX.width = core.offsetWidth
        gaugeYH = gaugeY.height = core.offsetHeight
        // 计算X原点坐标
        pointXZero = coreCanvas.offsetLeft - coreCanvas.offsetWidth / 2
        // 计算Y原点坐标
        pointYZero = coreCanvas.offsetTop - coreCanvas.offsetHeight / 2
        // 绘制坐标系
        draw()
    }

    reset()
    window.onresize = () => {
        reset()
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
                gaugeXCtx.fillStyle = gaugeXCtx.strokeStyle = 'rgb(102, 102, 102)'
                gaugeYCtx.fillStyle = gaugeYCtx.strokeStyle = 'rgb(102, 102, 102)'
            }
            // 
            gaugeYCtx.lineWidth = gaugeXCtx.lineWidth = 0.5
            // 线宽0.5 模糊解决 pointXZero + i * 50 - (0.5)
            // 原点向右
            // 0 50 100 150


            gaugeXCtx.moveTo(pointXZero + i * 50 - 0.5, 0)
            gaugeXCtx.lineTo(pointXZero + i * 50 - 0.5, gaugeXH)

            gaugeYCtx.moveTo(0 - 0.5, pointYZero + i * 50)
            gaugeYCtx.lineTo(gaugeYW - 0.5, pointYZero + i * 50)

            // Y 
            gaugeYCtx.moveTo((gaugeYW - 0.5) * 0.8, pointYZero + i * 50 + 10)
            gaugeYCtx.lineTo(gaugeYW - 0.5, pointYZero + i * 50 + 10)

            gaugeYCtx.moveTo((gaugeYW - 0.5) * 0.65, pointYZero + i * 50 + 20)
            gaugeYCtx.lineTo(gaugeYW - 0.5, pointYZero + i * 50 + 20)

            gaugeYCtx.moveTo((gaugeYW - 0.5) * 0.8, pointYZero + i * 50 + 30)
            gaugeYCtx.lineTo(gaugeYW - 0.5, pointYZero + i * 50 + 30)

            gaugeYCtx.moveTo((gaugeYW - 0.5) * 0.65, pointYZero + i * 50 + 40)
            gaugeYCtx.lineTo(gaugeYW - 0.5, pointYZero + i * 50 + 40)
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
                gaugeYCtx.fillText(item, 0, pointYZero + i * 50 + 9 * (index + 1))
            })

            // 原点向左
            gaugeXCtx.moveTo(pointXZero - i * 50 - 0.5, 0)
            gaugeXCtx.lineTo(pointXZero - i * 50 - 0.5, gaugeXH)

            // Y
            gaugeYCtx.moveTo((gaugeYW - 0.5) * 0.8, pointYZero - i * 50 - 10)
            gaugeYCtx.lineTo(gaugeYW - 0.5, pointYZero - i * 50 - 10)

            gaugeYCtx.moveTo((gaugeYW - 0.5) * 0.65, pointYZero - i * 50 - 20)
            gaugeYCtx.lineTo(gaugeYW - 0.5, pointYZero - i * 50 - 20)

            gaugeYCtx.moveTo((gaugeYW - 0.5) * 0.8, pointYZero - i * 50 - 30)
            gaugeYCtx.lineTo(gaugeYW - 0.5, pointYZero - i * 50 - 30)

            gaugeYCtx.moveTo((gaugeYW - 0.5) * 0.65, pointYZero - i * 50 - 40)
            gaugeYCtx.lineTo(gaugeYW - 0.5, pointYZero - i * 50 - 40)
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
                gaugeYCtx.fillText(item, 0, pointYZero - i * 50 + 9 * (index + 1))
            })


            // 绘制
            gaugeXCtx.stroke()
            gaugeYCtx.stroke()

        }
    }
})();
