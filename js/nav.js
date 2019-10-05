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
            this[handle] && this[handle](el)
        }
    }

    // 导入图片
    ['import-img'] () {
        let file = document.createElement('input')
        file.type = 'file'
        // 限定上传类型
        file.accept = 'image/*'
        
        // 信息加载完成后
        file.onchange = function(e) {
            let files, url, image, curWidth, curHeight, svgEl
            files = this.files[0]
            // this.files[0].type 文件类型
            // 图片可预览地址
            url = window.URL.createObjectURL( files )
            // 获取图片原本宽高
            image = new Image()
            image.onload = function() {
                curWidth = this.width
                curHeight = this.height

                svgEl = Tool.createSvgEl('image')
                // 图片不显示, 调了半个多小时, 才发现, 这个元素的link属性不能通过attribute设置
                // svgEl.setAttribute('xlink:href', url)
                svgEl.href.baseVal = url
                svgEl.setAttribute('x', 0)
                svgEl.setAttribute('y', 0)
                svgEl.setAttribute('width', curWidth)
                svgEl.setAttribute('height', curHeight)
                
                publicVar.canvas.appendChild(svgEl)

            }
            image.src = url
        }
        
        // 触发文件窗口
        file.click()

        file.onerror = function(e) {
            console.log('数据加载 - error')
        }
    }

    // 切换辅助线状态， open or close
    ['toggle-auxiliary-line-sataus'] (el) {
        if(config.openAuxiliaryLine){ // 关闭
            // 获取辅助线
            let lineX = document.querySelector('.auxiliary-line .lineX'),
            lineY = document.querySelector('.auxiliary-line .lineY')

            el.innerText = '开启辅助线'
            // 辅助线应该回到原位
            lineX.style.top = publicVar.pointYZero + 'px'
            lineY.style.left = publicVar.pointXZero + 'px'            

        }else{
            el.innerText = '关闭辅助线'   
        }
        config.openAuxiliaryLine = !config.openAuxiliaryLine
    }

}


/*
    未解决bug
        导入图片功能有时候，明明选中了文件并点击l确定， 但就是不触发change事件。
*/