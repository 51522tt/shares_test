const { ipcRenderer } = require('electron')
const excelDB = require('./db/excelDB')
const baseDB = require('./db/baseDB')
const fs = require('fs')
const xlsx = require('node-xlsx');

const importBtn = document.getElementById('importBtn')
importBtn.addEventListener('click', (event) => {
  // 异步消息
  ipcRenderer.send('open-file-dialog', { name: 'hha' })
  // 同步消息
  // const msg = ipcRenderer.sendSync('open-file-dialog')
  // console.log(msg)
})

const selectAllBtn = document.getElementById('selectAllBtn')
selectAllBtn.addEventListener('click', (event) => {
  // 异步消息
  excelDB.getAll(data=>{
    console.log(data)
  })
})
ipcRenderer.on('reply', (event, arg) => {
  console.log('arg',arg)
  arg.forEach(filePath=>{
    console.log(`filePath：${filePath}`, )
    const fileName = filePath.split('/').pop()
    handleFileName(fileName)
    const sheets = xlsx.parse(fs.readFileSync(filePath));
    // 遍历 sheet
    sheets.forEach(sheet => {
      var excelObjArr = []
      sheet.data.forEach(row => {
        let excelObj = {}
        sheet.data[0].forEach((e, i) => {
          excelObj[e] = handle(row[i])
        })
        excelObj['file_name'] = fileName
        excelObjArr.push(excelObj)
      })
      excelObjArr.splice(0, 1)
      //存入数据库
      excelDB.insert(excelObjArr)
    })
  })
})
function handle(str) {
  if (str != '--') {
    return getExecStrs(str, /[0-9]*\.[0-9]*/g)
  }
  return 0
}

function getExecStrs(str, reg) {
  var result = reg.exec(str)
  if (!result) {
    return str
  }
  return result[0]
}
// 解析表格名称
function handleFileName(fileName) {
  var result = getExecStrs(fileName, /[0-9]*\.[0-9]*/g)
  console.log(`filename 年：${result.slice(0, 1)} 月：${result.slice(1, 3)} 日：${getExecStrs(fileName, /\.[0-9]*/g).split('.')[1]}`, )
}

// 转换单位
// 总市值 亿
// 流通   亿
// 股东数  万

// 策略
// 识别码为0或为空，需要容错（忽略）

// 需求1:
//  计算R = 总市值 / 股东数

//  计算Y = 流通 / 股东数

//  搜索识别码 （3个月、6个月、12个月、全部）

//  展示R、Y、价格、时间的关系
//  R、Y左侧竖坐标不同颜色
//  右侧竖坐标为价格
//  横坐标为time
//  可以选择R、Y选择展示还是一起展示
var R = 0
var Y = 0
// baseDB.insert()
// baseDB.createDBAndStore({
//   dataset:`
//   ++id,
//   file_name,
//   ident_code
//   `,
// })

// baseDB.select('',{dataset:''})
// excelDB.selectAll((dataset)=>{
//   dataset.forEach(e=>{
//     console.log(e.ident_code,
//       `R:${Math.floor(e.hkd_mn/e.share_num)}`,
//       `Y:${Math.floor(e.circulate/e.share_num)}`)
//   })
// })



// getExecStrs('1.2万亿')
// 需求2
  // 将识别码分类标签
  // 60***：沪A
  // 688**：科创
  // 00***：深A
  // 30***：创业
  // 不含以上：其他
  // 计算以上每日R、Y平均值

  // 筛选标签

  // 筛选时间段（3个月、6个月、12个月、全部）

  // 展示
  // 左右竖坐标：R、Y
  // 横坐标：time


// 需求3
// 计算每日的不同s区间的R、Y平均值
// s区间：
// s < 100
// 101 ~ 300
// 301 ~ 500
// 501 ~ 1000
// 1001 ~ 1500
// 1501 ~ 2000
// 2001 ~ 3000
// 3001 ~ 4000
// 4001 ~ 5000
// 5000+

// 筛选区间

// 筛选时间段（3个月、6个月、12个月、全部）

// 展示
// 左右竖坐标：R、Y平均值
// 横坐标：time


// 需求4
// 筛选时间段（1、2、3、6）

// 筛选识别码

// 展示：
// R、Y的价格变化幅度和时间
// 幅度为：+5% +10% +15% +20% +30% -5% -10% -15% -20% -30% 



// 需求5
// 根据R、Y选择数值区间，筛选识别码并展示
// R、Y可单独选
