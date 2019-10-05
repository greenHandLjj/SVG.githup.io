/**
 * 工具类库
 *  Tool.js
 * 
*/

(function(w) {

    class Tool {
        constructor() {
            return new init()
        }
    }

    // 共享原型
    init.prototype = Tool.prototype

    // 过渡者
    function init() {
        return this
    }

    // 获取除body以上的所有父节点
    Tool.prototype.getParentEl = function(dom, arr = [], cb) {
        let parent = dom.parentElement
        
        arr.push(dom)

        // 可选回调
        cb && cb(parent)

        if(parent && parent !== document.body){
            this.getParentEl(parent, arr)
        }
    
        return arr
    }

    // 获取离自己最近的position ！== static 的元素
    Tool.prototype.getRelativeParent = function(dom) {
        let relativeEl = null, n = 0
        this.getParentEl(dom, undefined, function(parent) {
            if( window.getComputedStyle(parent, null).position !== 'static' ){
                if(n === 0){
                    relativeEl = parent
                    n ++
                }
            }
        })
        return relativeEl || document.body
    }

    // 选择dom, 目前仅支持class, id, 标签名
    Tool.prototype.selectedDom = function(str) {
        let dom
        
        if(str.indexOf('.') >= 0) { // class
            dom = document.getElementsByClassName(str.slice(1))
        }else if(str.indexOf('#') >= 0) {
            dom = document.getElementById(str.slice(1))
        }else{
            dom = document.getElementsByTagName(str)
        }

        return dom instanceof Element ? dom : dom[0] 
    }

    // 创建SVG元素, SVG是XML, 不能通过HTML方式进行修改和创建
    Tool.prototype.createSvgEl = function(nodeName) {
        let svgEl = document.createElementNS('http://www.w3.org/2000/svg', nodeName)

        return svgEl
    }

    w.Tool = new Tool()
})(window)
