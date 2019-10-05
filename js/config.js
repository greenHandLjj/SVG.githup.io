/**
 *  SVG 编辑器的配置, 将于此处进行引入以及定义
 *  所有配置更改后将放于 localStorage 中进行保存
 * 
 *  config : {
 *      是否开启辅助线: true,
 *      是否开启可视化坐标: true 
 *      ...
 *  }
 * 
 * */ 

// 接管全局变量, 各个区域之间, 公有变量存在于此
let truePublicVar = {
    // 坐标轴横纵原点坐标, 初始化
    pointXZero: 0,
    pointYZero: 0,
    // 当前是否在拖动右边栏, 如果是, 需要禁止画布区的鼠标移动监测事件
    isChangeRightBar: false,
    // 画布区域需要监测宽度变化, reset 为函数
    reset: null,
    // 辅助线对齐
    auxiliaryLine: function() {
        let lineX = document.querySelector('.auxiliary-line .lineX'),
            lineY = document.querySelector('.auxiliary-line .lineY')

        // 定义默认值
        lineX.style.top = publicVar.pointYZero + 'px'
        lineY.style.left = publicVar.pointXZero + 'px'
    },
    // 画布
    canvas: document.querySelector('#canvas svg'),
    // 画布宽高
    canvasWidth: function() {
        return this.canvas.getAttribute('width')
    },
    canvasHeight: function() {
        return this.canvas.getAttribute('height')
    }
};

const publicVar = new Proxy(truePublicVar, {
    get: function(target, prop) {
        return target[prop]
    },
    set: function(target, prop, value) {

        if(prop === 'pointXZero' || prop === 'pointYZero'){
            target.auxiliaryLine()
        }

        target[prop] = value
    }
})

let config = localStorage.getItem('config') || {
    // 是否开启辅助线
    openAuxiliaryLine: false
}