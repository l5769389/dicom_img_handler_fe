import { app, BrowserWindow, Menu } from 'electron'

const path = require('path')
app.whenReady().then(() => {
  const win = new BrowserWindow({
    title: 'Main window',
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.webContents.openDevTools()
  if (process.env.NODE_ENV == 'development' ){
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  }else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
})

Menu.setApplicationMenu(null)
