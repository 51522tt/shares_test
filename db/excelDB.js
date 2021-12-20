const baseDB = require('./baseDB')
const EXCEL_STORE_CONFIG = {
    storeName: 'dataset'
}

// 查询数据

exports.getById = function (id) {
    return new Promise((resolve, reject) => {
        baseDB.store(EXCEL_STORE_CONFIG.storeName).getById(id).then(e => {
            resolve(e)
        }).catch(e => {
            reject(e)
        })
    })
}
exports.getAllByFileName = function (key) {
    return new Promise((resolve, reject) => {
        baseDB.store(EXCEL_STORE_CONFIG.storeName).index('file_name').getAllByIndexName(key).then(e => {
            resolve(e)
        }).catch(e => {
            reject(e)
        })
    })
}
exports.getAllByCode = function (key) {
    return new Promise((resolve, reject) => {
        baseDB.store(EXCEL_STORE_CONFIG.storeName).index('code').getAllByIndexName(key).then(e => {
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
exports.update = function (obj) {
    return new Promise((resolve, reject) => {
        baseDB.store(EXCEL_STORE_CONFIG.storeName).update(obj).then(e => {
            resolve(e)
        }).catch(e => {
            reject(e)
        })
    })

}

// 删除数据
exports.deleteByIdList = function (ids) {
    return new Promise((resolve, reject) => {
        baseDB.store(EXCEL_STORE_CONFIG.storeName).delete(ids).then(e => {
            resolve(e)
        }).catch(e => {
            reject(e)
        })
    })
}


exports.getAll= async function () {
    let result = await baseDB.store(EXCEL_STORE_CONFIG.storeName).getAllNew()
    resultHandle.value = result
    return resultHandle
}

exports.getAllByCode = async function (key) {
    let result = await baseDB.store(EXCEL_STORE_CONFIG.storeName).index('code').getAllByIndexName(key)
    resultHandle.value = result
    return resultHandle
}

class ResultHandle {
    value = null;
    where(e) {
        let tempResult = []
        this.value.forEach(el => {
            for (let key in e) {
                if (el[key] === e[key]) tempResult.push(el)
            }
        });
        this.value = e ? tempResult : this.value
        return this
    }
    group(key) {
        let tempResult = []
        this.value.forEach(el => {
            tempResult[el[key]] = tempResult[el[key]] || []
            tempResult[el[key]].push(el)
        });
        this.value = key ? tempResult : this.value
        return this
    }
    bettwn(obj) {
        let tempResult = []
        for(let key in obj){
            console.log(key)
            this.value.forEach(e=>{
                if(e[key]>obj[key].min && e[key]<obj[key].max)tempResult.push(e)
            })
        }
        this.value = obj ? tempResult : this.value
        return this
    }
    diyHandle(handel) {
        this.value = handel(this.value) || this.value
        return this
    }
}



const resultHandle = new ResultHandle()
