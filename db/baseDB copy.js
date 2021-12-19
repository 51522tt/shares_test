// 数据库实例
var db

const dbConfig = {
    dbName: 'sharesDB',
    dbVersion: 1
}
exports.dbConfig = dbConfig
// 数据库操作

// 初始化数据库
exports.init = () => {
    // 数据库配置
    const dbConfig = {
        dbName: 'sharesDB',
        dbVersion: 1
    }
    // 数据库连接/或新建
    const dbOpenRequst = window.indexedDB.open(dbConfig.dbName, dbConfig.dbVersion)
    console.log
    // 数据库监听
    dbOpenRequst.onerror = function (event) {
        console.error('数据库连接失败')
    }
    dbOpenRequst.onsuccess = function (event) {
        console.log('数据库连接成功')
        db = dbOpenRequst.result
    }
    dbOpenRequst.onupgradeneeded = function (event) {
        db = this.result;
        db.onerror = function (event) {
            console.error('数据库报错')
        };
        initExcelStore(db)
        
    }
}

function initExcelStore(db){
    const objStore = db.createObjectStore('excelStore')
    objStore.createIndex('file_name', 'file_name', { unique: false })
    objStore.createIndex('ident_code', 'ident_code', { unique: false })
    objStore.createIndex('price', 'price', { unique: false })
    objStore.createIndex('dyn_pe', 'dyn_pe', { unique: false })
    objStore.createIndex('turnover', 'turnover', { unique: false })
    objStore.createIndex('hkd_mn', 'hkd_mn', { unique: false })
    objStore.createIndex('circulate', 'circulate', { unique: false })
    objStore.createIndex('chage_hands', 'Chage_hands', { unique: false })
    objStore.createIndex('current_time', 'current_time', { unique: false })
    objStore.createIndex('share_num', 'share_num', { unique: false })
    console.log('excelStore initlaztion!!!')
}



/*

 */
