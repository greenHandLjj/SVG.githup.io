/**
 * 原: 
 *  svgDetails.js
 *      期望实现功能:
 *          传入一个svg元素, 获取这个元素的全部信息
 *              需要 可读, 可改, 可响应更新
 *           不同的SVG元素, 所拥有的的属性是不一样的
 *           rect        特点属性 x y width height
 *           line        特点属性 x1 y1 x2 y2
 *           polyline    特点属性 points
 *           ellipse     特点属性 cx cy rx ry
 *           text        特点属性 x y innerHTML
 *           path        特点属性 d
 *         也有比较常用的公有属性
 *              fill stroke stroke-width ...
 * ---------------------------------------------------------------
 * 改(程序调整,以上功能作废):
 *   svgDetails.js
 *      设计思路:
 *          充当中间变量 data, 存储被选中的svg属性等值
 *          通过对其 set 和 get 的监听, 实现数据绑定
 *          外部所有对svg的状态操作, 都需要通过其暴露的接口来实现操作
 *          中间变量的值, 将由已自定义好的构造函数来决定
 * 
*/

// 原: 
// class SvgDetails {
//     // 属性白名单
//     static filterAttr = ['x',
//         'y',
//         'width',
//         'height',
//         'fill',
//         'stroke',
//         'stroke-opacity',
//         'opacity',
//         'fill-opacity',
//         'stroke-width',
//         'cx',
//         'cy',
//         'rx',
//         'ry',
//         'x1',
//         'x2',
//         'y1',
//         'y2'
//     ];
//     static config = {
//         set(target, key, value) {
//             return target[key] = value
//         },
//         get(target, key) {
//             return target[key]
//         }
//     };
//     svgData = new Proxy({}, config);

//     constructor(svg) {
//         // 不接收类名, 直接引用传递
//         this.svg = svg

//         this.writeData(svg)
//     }

//     writeData(svg) {
//         let attr = svg.attributes,
//             attrName
//         for (let prop of attr) {
//             attrName = prop.nodeName
//             if (SvgDetails.filterAttr.includes(attrName)) {
//                 this.svgData[attrName] = prop.nodeValue
//             }
//         }
//     }

// }

// 改
(function (window) {
    let config = {
        get(target, key) {
            return target[key]
        },
        set(target, key, value) {
            
            // to do...
            return target[key] = value
        }
    }
    // 渲染区域
    let renderWrap = document.querySelector('.item-details')

    // 渲染属性
    let render = function(data) {
        let div, p, span
        // 初始化之前， 清空renderWrap
        renderWrap.innerHTML = ''
        for(let prop in data){
            div = document.createElement('div')
            p = document.createElement('p')
            span = document.createElement('span')

            p.innerText = data[prop]
            span.innerText = prop

            div.appendChild(p)
            div.appendChild(span)
            renderWrap.appendChild(div)
        }
    }

    class SvgDetails {
        constructor(attr) {
            this.init(attr)
        }

        // 初始化
        init(attr) {
            this.svgData = new Proxy({}, config)
            // 属性初始化
            for(let prop in attr){
                this.svgData[prop] = attr[prop]
            }
            // 渲染属性
            render(this.svgData)
        }

     }

    // export
    window.SvgDetails = SvgDetails
})(window)
