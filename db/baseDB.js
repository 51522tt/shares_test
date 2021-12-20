const { systemPreferences, MenuItem } = require("electron")

this.objectStore = null
this.request = null
this.dbIndex = null

const DB_CONFIG = {
    dbName: 'shares',
    dbVersion: 1
}


const createDB = function () {

    new Promise(function (resolve, reject) {
        let openObejctRequst = window.indexedDB.open(DB_CONFIG.dbName, DB_CONFIG.dbVersion)
        openObejctRequst.onsuccess = function (event) {
            console.log('connet successful!!!')
            db = openObejctRequst.result
        }
        openObejctRequst.onerror = function (event) {
            console.error('数据库连接失败')
            reject(event)
        }
        openObejctRequst.onupgradeneeded = function (evet) {
            console.log('数据库发生更新')
            db = openObejctRequst.result
            createStore('dataset', ['file_name', 'code', 'tag', 'date'])
            createStore('tagset', ['tag'])
        }
    })
}

function init () {
    console.log('connet to database')
    createDB()
}
function DB () {
    if (!db) throw new Error('DB未初始化,操作中断！！！')
    return db
}

function createStore (storeName, indexKVs) {
    console.log('create store')
    this.objectStore = DB().createObjectStore(storeName, { keyPath: 'id' })
    indexKVs.forEach(e => {
        console.log(e)
        objectStore.createIndex(e, e, { unique: false })
    })
}

var db = db || init()

exports.insert = function (object) {
    console.log('inserting....')
    return new Promise((resolve, reject) => {
        let request = this.objectStore.count()
        let objectStoreT = this.objectStore
        request.onsuccess = function (event) {
            let index = request.result
            object.forEach(element => {
                element.id = ++index
                objectStoreT.add(element)
            });
            console.log('insert successful!!!')
            resolve(event)
        }
        request.onerror = function (event) {
            reject(event)
        }
    })
}

exports.store = function (storeName) {
    console.log('current store:', storeName)
    this.objectStore = DB().transaction([storeName], "readwrite").objectStore(storeName)
    return this
}

exports.index = function (indexName) {
    this.dbIndex = this.objectStore.index(indexName)
    return this
}

exports.getAllByIndexName = function (indexValue) {
    return new Promise((resolve, reject) => {
        let request = this.dbIndex.getAll(indexValue, 0)
        console.log(request)
        request.onsuccess = function (event) {
            resolve(event.target.result)
        }
        request.onerror = function (event) {
            reject(event)
        }
    })
}


exports.getAll = function () {
    return new Promise((resolve, reject) => {
        let request = this.objectStore.getAll()
        request.onsuccess = function (event) {
            resolve(event.target.result)
        }
        request.onerror = function (event) {
            reject(event)
        }
    })
}

exports.getById = function (id) {
    return new Promise((resolve, reject) => {
        let request = this.objectStore.get(id)
        request.onsuccess = function (event) {
            resolve(event.target.result)
        }
        request.onerror = function (event) {
            reject(event)
        }
    })
}

exports.update = function (obj) {
    return new Promise((resolve, reject) => {
        let request = this.objectStore.put(obj)
        request.onsuccess = function (event) {
            resolve(event.target.result)
        }
        request.onerror = function (event) {
            reject(event)
        }
    })
}

exports.delete = function (ids) {
    return new Promise((resolve, reject) => {
        for (let index in ids) {
            let request = this.objectStore.delete(ids[index])
            request.onsuccess = function (event) {
                resolve(event)
            }
            request.onerror = function (event) {
                reject(event)
            }
        }

    })
}
