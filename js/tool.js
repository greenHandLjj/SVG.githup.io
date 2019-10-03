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
    Tool.prototype.getParentEl = function(dom, arr = []) {
        let parent = dom.parentElement
        
        arr.push(dom)
        if(parent && parent !== document.body){
            this.getParentEl(parent, arr)
        }
    
        return arr
    }

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

    w.Tool = new Tool()
})(window)
