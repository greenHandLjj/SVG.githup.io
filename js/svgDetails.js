/**
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
 * 
            {
                x: xx,
                y: xx,
                fill: xx,
                stroke: ,

            }
 * 
*/

class SvgDetails {
    // 属性白名单
    static filterAttr = ['x',
        'y',
        'width',
        'height',
        'fill',
        'stroke',
        'stroke-opacity',
        'opacity',
        'fill-opacity',
        'stroke-width',
        'cx',
        'cy',
        'rx',
        'ry',
        'x1',
        'x2',
        'y1',
        'y2'
    ];
    static config = {
        set(target, key, value) {
            console.log("你想set我: ", key, value)
            return target[key] = value
        },
        get(target, key) {
            return target[key]
        }
    };
    svgData = new Proxy({}, config);
       
    constructor(svg) {
        // 不接收类名, 直接引用传递
        this.svg = svg

        this.writeData(svg)
    }

    writeData(svg) {
        let attr = svg.attributes,
            attrName
        for (let prop of attr) {
            attrName = prop.nodeName
            if (SvgDetails.filterAttr.includes(attrName)) {
                this.svgData[attrName] = prop.nodeValue
            }
        }
    }

}

