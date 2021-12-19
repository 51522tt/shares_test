const { app, BrowserWindow,ipcMain,dialog } = require('electron')
const path = require('path')
// try{
//     require('electron-reloader')(module)
// }catch(_){}
function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation:false,
            preload: path.join(__dirname, 'preload.js')
          }
    })

    win.loadFile('index.html')
    win.webContents.openDevTools();

}


app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') app.quit()
    })
})
ipcMain.on('open-file-dialog', (event,arg) => {
    console.log('open-file-dialog',arg)
    dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'],filters: [
        { name: 'Excel', extensions: ['xlsx'] }
        // {name:'Text',extensions:['txt']}
      ]}).then((e)=>{
        console.log(e)
        console.log(e.canceled)
        if(!e.canceled){
            event.sender.send('reply',e.filePaths)
        }else{
            console.log('取消了')
        }
    })
})


// 同步消息
// ipcMain.on('open-file-dialog',event=>{event.returnValue='hello';})
