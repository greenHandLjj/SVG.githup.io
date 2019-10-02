/**
 *  拖拽功能封装
 *      暂定 DOM
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
    constructor (el: document.createElement('div')) {
        
        el.addEventlistener('mousedown', this.down, false)
        el.addEventlistener('mousedown', this.down, false)


    }
    // 按下
    down() {

    }
    // 移动
    move() {

    }

    // 抬起
    up() {

    }
}
