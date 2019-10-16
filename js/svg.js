/**
 * 核心功能: 操作 SVG
 *      因为不同的svg拥有特性的差异, API无法很好的统一, 不如为每一个svg元素单独定义一个类
 *      描述该svg的属性操作
 * 
 *   
 * 仿照 DOM 元素的原型继承
 *      HTMLElement -> HTML[El]Elemnnt
 *                 ↓↓↓↓↓
 *      SvgElement[L] -> SvgLineElement[L]
 *      [L]为特定后缀, 防止和原有构造函数冲突, 代表自定义
 *          
 *      所有构造函数中的传递参数 el 均为原生SVG元素, 不支持选择器
 * 
*/

// 父类, 提供公有属性的操作
class SVGElementL {
    constructor() {

    }

    // 处理属性输入
    setAttr() {
        if (Object.prototype.toString.call(arguments[0]) === '[object Object]') {
            let obj = arguments[0]
            for (let prop in obj) {
                this.svg.setAttribute(prop, obj[prop])
            }
        } else if (arguments.length === 2) {
            this.svg.setAttribute(arguments[0], arguments[1])
        } else {
            throw ('参数类型错误, 请输入符合要求的参数类型 ---> ({width：200}) 或 (width, 200) ')
        }
    }

    // 创建可视化操作方形元素
    createViewRect({ x, y }) {
        // this 指向 被继承的子类的实例
        let div = document.createElement('div'),
            wrap = document.querySelector('main > .canvas-wrap')

        div.classList.add('view-rect')
        div.style.left = publicVar.pointXZero + (x - 4) + 'px'
        div.style.top = publicVar.pointYZero + (y - 4) + 'px'

        wrap.appendChild(div)

        new DomDrag({
            el: div,
            boundary: wrap
        })
        // 方便后续操作
        this.viewRects.push(div)
    }
}

// Polyline
class SVGPolylineElementL extends SVGElementL {
    constructor(el) {
        super()
        // 挂载
        this.svg = el;
    }
}

// Line
class SVGLineElementL extends SVGElementL {
    viewRects = [];

    constructor(el) {
        super()
        // 挂载
        this.svg = el
        // 坐标点
        this.x1 = el.getAttribute('x1')
        this.y1 = el.getAttribute('y1')
        this.x2 = el.getAttribute('x2')
        this.y2 = el.getAttribute('y2')

        // super.createViewRect({x: Number(this.x1), y: Number(this.y1)})
        // super.createViewRect({x: Number(this.x2), y: Number(this.y2)})
        // 注入属性值, 并且存入全局对象中
        publicVar.svgDetails = new SvgDetails({
            x1: this.x1,
            y1: this.y1,
            x2: this.x2,
            y2: this.y2
        })
    }


}

// Rect
class SVGRectElementL extends SVGElementL {
    constructor(el) {
        super()
        // 挂载
        this.svg = el
    }

}

// Ellipse
class SVGEllipseElementL extends SVGElementL {
    constructor(el) {
        super()
        // 挂载
        this.svg = el
    }
}

// Path
class SVGPathElementL extends SVGElementL {
    constructor(el) {
        super()
        // 挂载
        this.svg = el
    }
}

// Text
class SVGTextElementL extends SVGElementL {
    constructor(el) {
        super()
        // 挂载
        this.svg = el
    }
}

// Image
class SVGImageElementL extends SVGElementL {
    constructor(el) {
        super()
        // 挂载
        this.svg = el
    }
}