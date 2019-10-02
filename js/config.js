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

let config = localStorage.getItem('config') || {
    // 是否开启辅助线
    openAuxiliaryLine: false
}