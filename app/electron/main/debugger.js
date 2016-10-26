const { app } = require('electron')
const { BrowserWindow } = require('electron')
const localShortcut = require('electron-localshortcut')

const toggleDevTools = (win) => {
  win = win || BrowserWindow.getFocusedWindow()

  if (win) {
    win.toggleDevTools()
  }
}

const forceRefresh = (win) => {
  win = win || BrowserWindow.getFocusedWindow()

  if (win) {
    win.webContents.reloadIgnoringCache()
  }
}

app.on('ready', () => {
  localShortcut.register('CmdOrCtrl+Alt+I', toggleDevTools)
  localShortcut.register('CmdOrCtrl+Shift+I', toggleDevTools)

  localShortcut.register('CmdOrCtrl+R', forceRefresh)
  localShortcut.register('F5', forceRefresh)
})