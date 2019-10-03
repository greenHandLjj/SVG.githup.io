/**
 *  nav.js 核心功能 -- 实现导航栏众多功能的事件处理
 *  理想： 
 *      通过一个类， 处理事件委托， 传递不同的函数和类名， 实现不同的功能
 */

class Nav{
    constructor({el}) {
        this.el = Tool.selectedDom(el)
        this.bindEvent(this.el)
    }

    bindEvent(el) {
        el.addEventListener('mousedown', this.handle.bind(this))
    }

    handle(e) {
        let arr, el, handle
            
        arr = Tool.getParentEl(e.target)
        el = arr.find(item => {
            // 找到父级为a标签并且该 a标签可用
            if( item.classList.contains('available') ){
                return item 
            }
        })

        // 如果找到了， 再触发相应函数
        if(el) {
            handle = el.getAttribute('data-handle')
            this[handle] && this[handle]()
        }
    }

    // 导入图片
    ['import-img'] () {
        let file = document.createElement('input')
        file.type = 'file'

        // 触发文件窗口
        file.click()

        file.onchange = function(e) {
            console.log(e)
        }

    }

}
