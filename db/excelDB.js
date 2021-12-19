const baseDB = require('./baseDB')
const EXCEL_STORE_CONFIG = {
    storeName : 'dataset'
}


// 查询数据
exports.getAll = function(callback){
    baseDB.getAll(EXCEL_STORE_CONFIG.storeName,callback)
}
// 新增数据
exports.insert = function(obj){
    baseDB.insert(EXCEL_STORE_CONFIG.storeName,obj)
}
// 删除数据
// 更新数据