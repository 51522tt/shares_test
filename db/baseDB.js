const { systemPreferences } = require("electron")
const { dbConfig } = require("./baseDB copy")


const DB_CONFIG ={
    dbName:'shares',
    dbVersion:3
}

const createDB = new Promise(function(resolve,reject){
    console.log('create database')
    let openObejctRequst = window.indexedDB.open(DB_CONFIG.dbName, DB_CONFIG.dbVersion)
    openObejctRequst.onsuccess = function(event){
        console.log('created database')
        db = openObejctRequst.result
    }
    openObejctRequst.onerror = function(event){
        console.error('数据库连接失败')
        reject(event)
    }
    openObejctRequst.onupgradeneeded = function(evet){
        console.log('数据库发生更新')
        resolve(openObejctRequst.result)
    }
})
function init(){
    console.log('init database')
    createDB.then(result=>{
        db = result
        console.log('数据库连接成功')
        createStore()
    }).catch()
}
function DB(){
    if(!db) {throw new Error('DB未初始化,操作中断！！！')}
    return db
}

function createStore(){
    console.log('create store')
    let objectStore = DB().createObjectStore('dataset',{keyPath:'id'})
    objectStore.createIndex('file_name','file_name',{unique:false})
    objectStore.createIndex('ident_code','ident_code',{unique:false})
    console.log(objectStore)
}
var db = db || init()

exports.insert =  function (storeName,object){
    let objectStore= DB().transaction([storeName], "readwrite").objectStore(storeName)
    let request = objectStore.count()
    request.onsuccess = function(){
        let index  = request.result
        console.log(index)
        object.forEach(e=>{
            e.id=++index
           objectStore.add(e)
        })
    }
    
}

exports.getAll = function (storeName,callback){
    let objectStore= DB().transaction([storeName], "readwrite").objectStore(storeName)
    let request =  objectStore.getAll()
    request.onsuccess = function(){
        callback(request.result)
    }
}

