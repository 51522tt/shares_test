const baseDB = require('./baseDB')
const EXCEL_STORE_CONFIG = {
    storeName: 'tagset'
}

// 查询数据
exports.getAll = function () {
    return new Promise((resolve, reject) => {
        baseDB.store(EXCEL_STORE_CONFIG.storeName).getAll().then(e => {
            resolve(e)
        }).catch(e => {
            reject(e)
        })
    })
}
exports.getById = function (id) {
    return new Promise((resolve, reject) => {
        baseDB.store(EXCEL_STORE_CONFIG.storeName).getById(id).then(e => {
            resolve(e)
        }).catch(e => {
            reject(e)
        })
    })
}
exports.getAllByTag = function (key) {
    return new Promise((resolve, reject) => {
        baseDB.store(EXCEL_STORE_CONFIG.storeName).index('tag').getAllByIndexName(key).then(e => {
            resolve(e)
        }).catch(e => {
            reject(e)
        })
    })
}



// 新增数据
exports.insert = function (obj) {
    return new Promise((resolve, reject) => {
        baseDB.store(EXCEL_STORE_CONFIG.storeName).insert(obj).then(e => {
            resolve(e)
        }).catch(e => {
            reject(e)
        })
    })
}

/**
 * 更新数据
 * @param   obj  包含被修改数据的ID 
 * @returns None
 */
exports.update= function (obj) {
    return new Promise((resolve, reject) => {
        baseDB.store(EXCEL_STORE_CONFIG.storeName).update(obj).then(e => {
            resolve(e)
        }).catch(e => {
            reject(e)
        })
    })

}

// 删除数据
exports.deleteByIdList = function (ids){
    return new Promise((resolve, reject) => {
        baseDB.store(EXCEL_STORE_CONFIG.storeName).delete(ids).then(e => {
            resolve(e)
        }).catch(e => {
            reject(e)
        })
    })
}



