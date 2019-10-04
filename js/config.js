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
const publicVar = {
    // 坐标轴横纵原点坐标, 初始化
    pointXZero: 0,
    pointYZero: 0,
    // 当前是否在拖动右边栏, 如果是, 需要禁止画布区的鼠标移动监测事件
    isChangeRightBar: false,
    // 画布区域需要监测宽度变化, reset 为函数
    reset: null,
    // 画布
    canvas: document.querySelector('#canvas svg')
};

let config = localStorage.getItem('config') || {
    // 是否开启辅助线
    openAuxiliaryLine: false
}