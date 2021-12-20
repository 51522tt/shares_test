const { ipcRenderer } = require('electron')
const excelDB = require('./db/excelDB')
const fs = require('fs')
const xlsx = require('node-xlsx');
const echarts = require('echarts');




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
  test()
  // 异步消息
  // excelDB.getById(5).then(data => {
  //   console.log(data)
  // })
  //  excelDB.getAll().then(data=>{
  //     console.log(data)
  // })
  // excelDB.getAllByFileName('101.11数据.xlsx').then(e=>{
  //   console.log(e)
  // })
  // excelDB.getAllByTag('创业').then(e => {
  //   console.log(e)
  // })
  // excelDB.update({
  //   id:4237,
  //   file_name:'100.11数据.xlsx'
  // })
  // excelDB.deleteByIdList([1,2,3]).then(
  //   e=>{
  //     console.log(e)
  //   }
  // )

})


ipcRenderer.on('reply', (event, arg) => {
  console.log('arg', arg)
  arg.forEach(filePath => {
    // Mac os
    const fileName = filePath.split('/').pop()
    // Win os
    // const fileName = filePath.split('\\').pop()
    console.log(`filePath：${filePath}`,)
    console.log(`fileName: ${fileName}`,)
    var dataTime = handleFileName(fileName)
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
        excelObj['code'] = getExecStrs(excelObj['识别码'], /[0-9]{6}/g)
        excelObj['date'] = dataTime
        excelObj['R'] = excelObj['总市值'] / excelObj['股东数'],
          excelObj['Y'] = excelObj['流通'] / excelObj['股东数'],
          excelObj['tag'] = handleTag(excelObj['code'])
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
  console.log(`filename 年：${result.slice(0, 1)} 月：${result.slice(1, 3)} 日：${getExecStrs(fileName, /\.[0-9]*/g).split('.')[1]}`,)
  return `${'202' + result.slice(0, 1)}/${result.slice(1, 3)}/${getExecStrs(fileName, /\.[0-9]*/g).split('.')[1]}`
}
// 解析识别码
function handleTag(str) {
  let regs = [
    { reg: /^(60)[0-9]{4}/g, tag: '沪A' },
    { reg: /^(688)[0-9]{3}/g, tag: '科创' },
    { reg: /^(00)[0-9]{4}/g, tag: '深A' },
    { reg: /^(30)[0-9]{4}/g, tag: '创业' },
    { reg: /^[0-9]{6}/g, tag: '其他' },
  ]
  for (let index in regs) {
    if (regs[index].reg.exec(str)) {
      return regs[index].tag
    }
  }
  return null
}

// 转换单位
// 总市值 亿 S
// 流通   亿
// 股东数  万

// 策略
// 识别码为0或为空，需要容错（忽略）
function test() {
  getByCode('000039')
  group()
}
// 需求1:
//  搜索识别码 （3个月、6个月、12个月、全部）
//  展示R、Y、价格、时间的关系
//  R、Y左侧竖坐标不同颜色
//  右侧竖坐标为价格
//  横坐标为time
//  可以选择R、Y选择展示还是一起展示
async function getByCode(code) {
  let a = (await excelDB.getAllByCode()).value
  console.log('result', a)
  let b = groupHandle(a,'date')
  let datelist = []
  let valuelistR = []
  let valuelistY = []
  console.log('b', b)
  for(let key in b){
    datelist.push(key)
    valuelistR.push(computCount(jsonToArr(b[key],'R')))
    valuelistY.push(computCount(jsonToArr(b[key],'Y')))
  }
  console.log('valuelistR', valuelistR)
  console.log('valuelistY', valuelistY)
  var myChart = echarts.init(document.getElementById('xq1'));
  var option = {
    xAxis: {
      type: 'category',
      data: datelist
    },
    yAxis: {
      type: 'value'
    },
    legend: {
      data: ['R', 'Y'],
      left: 10
    },
    series: [
      {
        name: 'R',
        data: valuelistR,
        type: 'line'
      },
      {
        name: 'Y',
        data: valuelistY,
        type: 'line'
      }
    ]
  };
  myChart.setOption(option);
}


// 需求2
// 将识别码分类标签
// 60****：沪A
// 688***：科创
// 00****：深A
// 30****：创业
// 不含以上：其他
// 计算以上每日R、Y平均值
// tag RY 合计
// 归类RY 按识别码.日期
async function group() {
  let a = (await excelDB.getAll()).group('tag').diyHandle(e => {
    for (let k in e) {
      e[k] = groupHandle(e[k], 'date')
      for (let i in e[k]) {
        e[k][i] = computAvg(jsonToArr(e[k][i], 'R'))
      }
    }
    return e
  }).value
  console.log('xq2', a)
  var datelist = []
  var taglist = []
  var vallistR=[]
  var vallistY=[]

  // var myChart = echarts.init(document.getElementById('xq2'));
  // var option = {
  //   xAxis: {
  //     type: 'category',
  //     data: datelist
  //   },
  //   yAxis: {
  //     type: 'value'
  //   },
  //   legend: {
  //     data: ['R', 'Y'],
  //     left: 10
  //   },
  //   series: [
  //     {
  //       name: 'R',
  //       data: valuelistR,
  //       type: 'line'
  //     },
  //     {
  //       name: 'Y',
  //       data: valuelistY,
  //       type: 'line'
  //     }
  //   ]
  // };
  // myChart.setOption(option);
}

function groupHandle(obj, key) {
  let tempResult = []
  obj.forEach(el => {
    tempResult[el[key]] = tempResult[el[key]] || []
    tempResult[el[key]].push(el)
  });
  return tempResult
}


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
// xq3
async function xq3() {
  let a = (await excelDB.getAllNew()).diyHandle(e => {
    var SR = {
      '<100': {},
      '<300': {},
      '<500': {},
      '<1000': {},
      '<1500': {},
      '<2000': {},
      '<3000': {},
      '<4000': {},
      '<5000': {},
      '5000+': {}
    }
    e.forEach(el => {
      let S = parseFloat(el['总市值']) || 0
      let date = el.date
      if (S < 100) {
        SR['<100'][date] = SR['<100'][date] || []
        SR['<100'][date].push(S)
      } else if (S < 300) {
        SR['<300'][date] = SR['<300'][date] || []
        SR['<300'][date].push(S)
      } else if (S < 500) {
        SR['<500'][date] = SR['<500'][date] || []
        SR['<500'][date].push(S)
      } else if (S < 1000) {
        SR['<1000'][date] = SR['<1000'][date] || []
        SR['<1000'][date].push(S)
      } else if (S < 1500) {
        SR['<1500'][date] = SR['<1500'][date] || []
        SR['<1500'][date].push(S)
      } else if (S < 2000) {
        SR['<2000'][date] = SR['<2000'][date] || []
        SR['<2000'][date].push(S)
      } else if (S < 3000) {
        SR['<3000'][date] = SR['<3000'][date] || []
        SR['<3000'][date].push(S)
      } else if (S < 4000) {
        SR['<4000'][date] = SR['<4000'][date] || []
        SR['<4000'][date].push(S)
      } else if (S < 5000) {
        SR['<5000'][date] = SR['<5000'][date] || []
        SR['<5000'][date].push(S)
      } else {
        SR['5000+'][date] = SR['5000+'][date] || []
        SR['5000+'][date].push(S)
      }
    })
    for (let key in SR) {
      for (let k in SR[key]) {
        SR[key][k] = computAvg(SR[key][k])
      }
    }
    return SR
  }).value
  console.log('result', a)
}

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
async function xq4() {
  let bettwn = { Y: { min: 10, max: 14 } }
  let a = (await excelDB.getAll()).bettwn(bettwn).value
  console.log('result', a)
}



// 
async function getDataById(id) {
  let a = (await excelDB.getAll()).where({ id: id }).value
  console.log('a', a)
}


// group



//

// 计算平均值
function computAvg(arr) {
  let sum = 0
  arr.forEach(e => {
    sum += parseFloat(e)
  })
  return sum / arr.length
}
function computCount(arr) {
  let sum = 0
  arr.forEach(e => {
    sum += parseFloat(e)
  })
  return sum
}
function jsonToArr(obj, key) {
  let tempArr = []
  obj.forEach(e => {
    let val = e[key] || 0
    tempArr.push(val)
  })
  return tempArr
}