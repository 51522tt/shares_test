const { dbConfig } = require('./baseDB')
// 查询数据
exports.selectAll = function (datasethandle) {
    var db;
    // 数据库配置
    // 数据库连接/或新建
    const dbOpenRequst = window.indexedDB.open(dbConfig.dbName, dbConfig.dbVersion)
    // 数据库监听
    dbOpenRequst.onerror = function (event) {
        console.log('数据库报错', event)
    }
    dbOpenRequst.onsuccess = function (event) {
        // console.log('数据库创建成功', event)
        db = dbOpenRequst.result
        var transaction = db.transaction(["excelStore"], "readwrite");
        transaction.oncomplete = function (event) {
            // console.log('oncomplete')
        };

        transaction.onerror = function (event) {
            console.log('error')
        };

        // you would then go on to do something to this database
        // via an object store
        var objectStore = transaction.objectStore("excelStore");
        var objectStoreRequest = objectStore.getAll()
        objectStoreRequest.onsuccess = function () {
            datasethandle(objectStoreRequest.result)
        }
    }
}

exports.selectByFileName = function (val,datasethandle) {
    console.log('selectByFileName')
    var db;
    // 数据库配置
    // 数据库连接/或新建
    const dbOpenRequst = window.indexedDB.open(dbConfig.dbName, dbConfig.dbVersion)
    // 数据库监听
    dbOpenRequst.onerror = function (event) {
        console.log('数据库报错', event)
    }
    dbOpenRequst.onsuccess = function (event) {
        // console.log('数据库创建成功', event)
        db = dbOpenRequst.result
        var transaction = db.transaction(["excelStore"], "readwrite");
        transaction.oncomplete = function (event) {
            // console.log('oncomplete')
        };

        transaction.onerror = function (event) {
            console.log('error')
        };

        // you would then go on to do something to this database
        // via an object store
        var objectStore = transaction.objectStore("excelStore").index('file_name');
        var objectStoreRequest = objectStore.get(val)
        objectStoreRequest.onsuccess = function () {
            datasethandle(objectStoreRequest.result)
        }
    }
}

// 新增数据
exports.insert = (data) => {
    var db;
    // 数据库连接/或新建
    const dbOpenRequst = window.indexedDB.open(dbConfig.dbName, dbConfig.dbVersion)
    // 数据库监听
    dbOpenRequst.onerror = function (event) {
        console.error('数据库连接报错', event)
    }
    dbOpenRequst.onsuccess = function (event) {
        console.log('数据库连接成功', event)
        db = dbOpenRequst.result
        var transaction = db.transaction(["excelStore"], "readwrite");
        transaction.oncomplete = function (event) {
            console.log('oncomplete')
        };
        transaction.onerror = function (event) {
            console.error('error')
        };
        // you would then go on to do something to this database
        // via an object store
        var objectStore = transaction.objectStore("excelStore");
        data.forEach(element => {
            objectStore.add(element)
        });
    }
}
// 删除数据
// 更新数据