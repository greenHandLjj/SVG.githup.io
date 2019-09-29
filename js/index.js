// 导航菜单， 点击出子项
let list = [...document.querySelectorAll('header nav .list')],
    // 上一个被选中的list
    lastList = null,
    // 当点击一个列表项后, 鼠标直接移入其他列表项即可触发下拉菜单
    lock = false

list.forEach(item => {
    item.addEventListener('mousedown', toggleClass)
    item.addEventListener('mouseenter', function(e) {
        // 移入列表项, 只有在没有selected 类名的时候 才能再次进行切换
        if(lock && !e.target.classList.contains('selected')){
            toggleClass.call(this, e)
        }
        e.stopPropagation()
        e.preventDefault()
    })
})

function toggleClass(e) {
    // 上一个被选中的itembox
    let itemBox = this.getElementsByClassName('item-box')[0]
        classList = itemBox.classList

    // 在点击下一个元素前先将上一个元素样式清除
    if(lastList !== null && lastList !== this){
        lastList.classList
            .remove('selected')

        lastList.getElementsByClassName('item-box')[0]
            .classList
                .replace('show', 'hide')
    }

    // 重新记录上一个被选中元素
    lastList = this
    lock = true

    // 是否隐藏
    if(classList.contains('hide')){
        
        classList.remove('hide')
        classList.add('show')
        this.classList.add('selected')

    }else{

        classList.remove('show')
        classList.add('hide')

        this.classList.remove('selected')
    }

    e.stopPropagation && e.stopPropagation()

}

document.addEventListener('mousedown', function() {
    if(lastList !== null){
        lastList.classList
            .remove('selected')

        lastList.getElementsByClassName('item-box')[0]
            .classList
                .replace('show', 'hide')
    }
    lastList = null
    lock = false
})