import { app, BrowserWindow, Menu, ipcMain, session } from 'electron'
import electronLocalshortcut from 'electron-localshortcut'
import path from 'path'
import url from 'url'
import { autoUpdater } from 'electron-updater'
import config from './config'
import electronStore from '../shared/electronStore'
import { waggleVersion, runWaggle } from './waggleManager'
import debug from 'debug'
import { ConnectionsManager } from 'waggle/lib/libp2p/connectionsManager'
import { DataServer } from 'waggle/lib/socket/DataServer'

import { setEngine, CryptoEngine } from 'pkijs'
import { Crypto } from '@peculiar/webcrypto'

const log = Object.assign(debug('zbay:main'), {
  error: debug('zbay:main:err')
})

electronStore.set('appDataPath', app.getPath('appData'))
electronStore.set('waggleVersion', waggleVersion)

export const isDev = process.env.NODE_ENV === 'development'
export const isE2Etest = process.env.E2E_TEST === 'true'
const webcrypto = new Crypto()

interface IWindowSize {
  width: number
  height: number
}

const windowSize: IWindowSize = {
  width: 800,
  height: 540
}

setEngine(
  'newEngine',
  webcrypto,
  new CryptoEngine({
    name: '',
    crypto: webcrypto,
    subtle: webcrypto.subtle
  })
)

let mainWindow: BrowserWindow | null

const isBrowserWindow = (window: BrowserWindow | null): window is BrowserWindow => {
  return window instanceof BrowserWindow
}

const gotTheLock = app.requestSingleInstanceLock()

const extensionsFolderPath = `${app.getPath('userData')}/extensions`

const applyDevTools = async () => {
  /* eslint-disable */
  if (!isDev || isE2Etest) return
  /* eslint-disable */
  require('electron-debug')({
    showDevTools: true
  })
  const installer = require('electron-devtools-installer')
  const { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer')
  /* eslint-enable */
  const extensionsData = [
    {
      name: REACT_DEVELOPER_TOOLS,
      path: `${extensionsFolderPath}/${REACT_DEVELOPER_TOOLS.id}`
    },
    {
      name: REDUX_DEVTOOLS,
      path: `${extensionsFolderPath}/${REDUX_DEVTOOLS.id}`
    }
  ]
  await Promise.all(
    extensionsData.map(async extension => {
      await installer.default(extension.name)
    })
  )
  await Promise.all(
    extensionsData.map(async extension => {
      await session.defaultSession.loadExtension(extension.path, { allowFileAccess: true })
    })
  )
}

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', _commandLine => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
    // const url = new URL(commandLine[process.platform === 'win32' ? 3 : 1])
    // if (url.searchParams.has('invitation')) {
    //   mainWindow.webContents.send('newInvitation', {
    //     invitation: url.searchParams.get('invitation')
    //   })
    // }
    // if (url.searchParams.has('importchannel')) {
    //   mainWindow.webContents.send('newChannel', {
    //     channelParams: url.searchParams.get('importchannel')
    //   })
    // }
  })
}

app.on('open-url', (event, url) => {
  event.preventDefault()
  const data = new URL(url)
  if (mainWindow) {
    if (data.searchParams.has('invitation')) {
      mainWindow.webContents.send('newInvitation', {
        invitation: data.searchParams.get('invitation')
      })
    }
    if (data.searchParams.has('importchannel')) {
      mainWindow.webContents.send('newChannel', {
        channelParams: data.searchParams.get('importchannel')
      })
    }
  }
})

const checkForPayloadOnStartup = (payload: string) => {
  const isInvitation = payload.includes('invitation')
  const isNewChannel = payload.includes('importchannel')
  if (mainWindow && (isInvitation || isNewChannel)) {
    const data = new URL(payload)
    if (data.searchParams.has('invitation')) {
      mainWindow.webContents.send('newInvitation', {
        invitation: data.searchParams.get('invitation')
      })
    }
    if (data.searchParams.has('importchannel')) {
      mainWindow.webContents.send('newChannel', {
        channelParams: data.searchParams.get('importchannel')
      })
    }
  }
}

let browserWidth: number
let browserHeight: number

const createWindow = async () => {
  const windowUserSize = electronStore.get('windowSize')
  mainWindow = new BrowserWindow({
    width: windowUserSize ? windowUserSize.width : windowSize.width,
    height: windowUserSize ? windowUserSize.height : windowSize.height,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    autoHideMenuBar: true
  })
  mainWindow.setMinimumSize(600, 400)
  /* eslint-disable */
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, './index.html'),
      protocol: 'file:',
      slashes: true,
      hash: '/'
    })
  )
  /* eslint-enable */
  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.on('resize', () => {
    if (isBrowserWindow(mainWindow)) {
      const [width, height] = mainWindow.getSize()
      browserHeight = height
      browserWidth = width
    }
  })
  electronLocalshortcut.register(mainWindow, 'CommandOrControl+L', () => {
    if (isBrowserWindow(mainWindow)) {
      mainWindow.webContents.send('openLogs')
    }
  })
  electronLocalshortcut.register(mainWindow, 'F12', () => {
    if (isBrowserWindow(mainWindow)) {
      mainWindow.webContents.openDevTools()
    }
  })
}

let isUpdatedStatusCheckingStarted = false

const isNetworkError = (errorObject: { message: string }) => {
  return (
    errorObject.message === 'net::ERR_INTERNET_DISCONNECTED' ||
    errorObject.message === 'net::ERR_PROXY_CONNECTION_FAILED' ||
    errorObject.message === 'net::ERR_CONNECTION_RESET' ||
    errorObject.message === 'net::ERR_CONNECTION_CLOSE' ||
    errorObject.message === 'net::ERR_NAME_NOT_RESOLVED' ||
    errorObject.message === 'net::ERR_CONNECTION_TIMED_OUT'
  )
}

export const checkForUpdate = async (win: BrowserWindow) => {
  if (!isUpdatedStatusCheckingStarted) {
    try {
      await autoUpdater.checkForUpdates()
    } catch (error) {
      if (isNetworkError(error)) {
        log.error('Network Error')
      } else {
        log.error('Unknown Error')
        log.error(error == null ? 'unknown' : (error.stack || error).toString())
      }
    }
    autoUpdater.on('checking-for-update', () => {
      log('checking for updates...')
    })
    autoUpdater.on('error', error => {
      log(error)
    })
    autoUpdater.on('update-not-available', () => {
      log('event no update')
      electronStore.set('updateStatus', config.UPDATE_STATUSES.NO_UPDATE)
    })
    autoUpdater.on('update-available', info => {
      log(info)
      electronStore.set('updateStatus', config.UPDATE_STATUSES.PROCESSING_UPDATE)
    })

    autoUpdater.on('update-downloaded', () => {
      win.webContents.send('newUpdateAvailable')
    })
    isUpdatedStatusCheckingStarted = true
  }
  try {
    await autoUpdater.checkForUpdates()
  } catch (error) {
    if (isNetworkError(error)) {
      log.error('Network Error')
    } else {
      log.error('Unknown Error')
      log.error(error == null ? 'unknown' : (error.stack || error).toString())
    }
  }
}

let waggleProcess: { connectionsManager: ConnectionsManager; dataServer: DataServer } | null = null

app.on('ready', async () => {
  // const template = [
  //   {
  //     label: 'Zbay',
  //     submenu: [
  //       { role: 'undo' },
  //       { role: 'redo' },
  //       { type: 'separator' },
  //       { role: 'cut' },
  //       { role: 'copy' },
  //       { role: 'paste' },
  //       { role: 'pasteandmatchstyle' },
  //       { role: 'delete' },
  //       { role: 'selectall' },
  //       { type: 'separator' },
  //       { role: 'quit' }
  //     ]
  //   }
  // ]

  // app.on(`browser-window-created`, (e, window) => {
  //   mainWindow.setMenu(null)
  // })
  if (process.platform === 'darwin') {
    // const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(null)
  } else {
    Menu.setApplicationMenu(null)
  }

  await applyDevTools()

  await createWindow()
  log('created windows')

  if (!isBrowserWindow(mainWindow)) {
    throw new Error('mainWindow is on unexpected type {mainWindow}')
  }

  mainWindow.webContents.on('did-fail-load', () => {
    log('failed loading')
  })

  mainWindow.webContents.once('did-finish-load', async () => {
    if (!isBrowserWindow(mainWindow)) {
      throw new Error('mainWindow is on unexpected type {mainWindow}')
    }
    if (process.platform === 'win32' && process.argv) {
      const payload = process.argv[1]
      if (payload) {
        checkForPayloadOnStartup(payload)
      }
    }
    if (!isDev) {
      await checkForUpdate(mainWindow)
      setInterval(async () => {
        if (!isBrowserWindow(mainWindow)) {
          throw new Error(`mainWindow is on unexpected type ${mainWindow}`)
        }
        await checkForUpdate(mainWindow)
      }, 15 * 60000)
    }
  })

  ipcMain.on('proceed-update', () => {
    autoUpdater.quitAndInstall()
  })

  ipcMain.on('start-waggle', async () => {
    await waggleProcess?.connectionsManager.closeAllServices()
    await waggleProcess?.dataServer.close()
    waggleProcess = await runWaggle(mainWindow.webContents)
  })
})

app.setAsDefaultProtocolClient('zbay')

app.on('before-quit', async e => {
  e.preventDefault()
  if (waggleProcess !== null) {
    await waggleProcess.connectionsManager.closeAllServices()
    await waggleProcess.dataServer.close()
  }
  if (browserWidth && browserHeight) {
    electronStore.set('windowSize', {
      width: browserWidth,
      height: browserHeight
    })
  }
  process.exit()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // NOTE: temporarly quit macos when using 'X'. Reloading the app loses the connection with waggle. To be fixed.
  app.quit()
})

app.on('activate', async () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    await createWindow()
  }
})
