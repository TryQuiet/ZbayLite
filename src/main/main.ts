import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import electronLocalshortcut from 'electron-localshortcut'
import path from 'path'
import url from 'url'
import { autoUpdater } from 'electron-updater'

import config from './config'
import electronStore from '../shared/electronStore'
import Client from './cli/client'
import { getOnionAddress, spawnTor, runWaggle } from './waggleManager'

electronStore.set('appDataPath', app.getPath('appData'))
electronStore.set('waggleInitialized', false)

export const isDev = process.env.NODE_ENV === 'development'
const installExtensions = async () => {
  if (!isDev) return
  // eslint-disable-next-line
  require('electron-debug')({
    showDevTools: true
  })
  // eslint-disable-next-line
  const installer = require('electron-devtools-installer')
  const forceDownload = Boolean(process.env.UPGRADE_EXTENSIONS)
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']

  try {
    await Promise.all(extensions.map(ext => installer.default(installer[ext], forceDownload)))
  } catch (err) {
    console.error("Couldn't install devtools.")
  }
}

interface IWindowSize {
  width: number
  height: number
}

const windowSize: IWindowSize = {
  width: 800,
  height: 540
}

let mainWindow: BrowserWindow

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (commandLine) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
    const url = new URL(commandLine[process.platform === 'win32' ? 3 : 1])
    if (url.searchParams.has('invitation')) {
      mainWindow.webContents.send('newInvitation', {
        invitation: url.searchParams.get('invitation')
      })
    }
    if (url.searchParams.has('importchannel')) {
      mainWindow.webContents.send('newChannel', {
        channelParams: url.searchParams.get('importchannel')
      })
    }
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

const checkForPayloadOnStartup = payload => {
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
      nodeIntegration: true
    },
    autoHideMenuBar: true
  })
  mainWindow.setMinimumSize(600, 400)
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, './index.html'),
      protocol: 'file:',
      slashes: true,
      hash: '/zcashNode'
    })
  )

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.on('resize', () => {
    const [width, height] = mainWindow.getSize()
    browserHeight = height
    browserWidth = width
  })
  electronLocalshortcut.register(mainWindow, 'F11', () => {
    mainWindow.webContents.send('toggleCoordinator', {})
  })
  electronLocalshortcut.register(mainWindow, 'CommandOrControl+L', () => {
    mainWindow.webContents.send('openLogs')
  })
  // electronLocalshortcut.register(mainWindow, 'F12', () => {
  //   mainWindow.toggleDevTools()
  // })
}

let isUpdatedStatusCheckingStarted = false

const isNetworkError = errorObject => {
  return (
    errorObject.message === 'net::ERR_INTERNET_DISCONNECTED' ||
    errorObject.message === 'net::ERR_PROXY_CONNECTION_FAILED' ||
    errorObject.message === 'net::ERR_CONNECTION_RESET' ||
    errorObject.message === 'net::ERR_CONNECTION_CLOSE' ||
    errorObject.message === 'net::ERR_NAME_NOT_RESOLVED' ||
    errorObject.message === 'net::ERR_CONNECTION_TIMED_OUT'
  )
}

export const checkForUpdate = async (win) => {
  if (!isUpdatedStatusCheckingStarted) {
    try {
      await autoUpdater.checkForUpdates()
    } catch (error) {
      if (isNetworkError(error)) {
        console.log('Network Error')
      } else {
        console.log('Unknown Error')
        console.log(error == null ? 'unknown' : (error.stack || error).toString())
      }
    }
    autoUpdater.on('checking-for-update', () => {
      console.log('checking for updates...')
    })
    autoUpdater.on('error', error => {
      console.log(error)
    })
    autoUpdater.on('update-not-available', () => {
      console.log('event no update')
      electronStore.set('updateStatus', config.UPDATE_STATUSES.NO_UPDATE)
    })
    autoUpdater.on('update-available', info => {
      console.log(info)
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
      console.log('Network Error')
    } else {
      console.log('Unknown Error')
      console.log(error == null ? 'unknown' : (error.stack || error).toString())
    }
  }
}

let client: Client
let tor = null
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

  console.log('instaling extensions')
  await installExtensions()

  await createWindow()
  console.log('creatd windows')
  mainWindow.webContents.on('did-fail-load', () => {
    console.log('failed loading')
  })
  mainWindow.webContents.on('did-finish-load', async () => {
    mainWindow.webContents.send('ping')
    try {
      console.log('before spawning tor')
      tor = await spawnTor()
      mainWindow.webContents.send('onionAddress', getOnionAddress())
      await runWaggle(mainWindow.webContents)
    } catch (error) {
      console.log(error)
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
        await checkForUpdate(mainWindow)
      }, 15 * 60000)
    }
  })

  ipcMain.on('spawnTor', async () => {
    if (tor === null) {
      tor = await spawnTor()
      await runWaggle(mainWindow.webContents)
      electronStore.set('isTorActive', true)
    }
  })

  ipcMain.on('killTor', async () => {
    if (tor !== null) {
      await tor.kill()
      tor = null
    }
  })

  ipcMain.on('proceed-update', () => {
    autoUpdater.quitAndInstall()
  })
  client = new Client()
  ipcMain.on('rpcQuery', async (_event, arg) => {
    const request = JSON.parse(arg)
    const response = await client.postMessage(request.id, request.method, request.args)
    if (mainWindow) {
      mainWindow.webContents.send('rpcQuery', JSON.stringify({ id: request.id, data: response }))
    }
  })


  ipcMain.on('vault-created', () => {
    electronStore.set('vaultStatus', config.VAULT_STATUSES.CREATED)
  })

  ipcMain.on('proceed-with-syncing', (_event, userChoice) => {
    if (userChoice === 'EXISTING') {
      electronStore.set(
        'blockchainConfiguration',
        config.BLOCKCHAIN_STATUSES.DEFAULT_LOCATION_SELECTED
      )
    } else {
      electronStore.set('blockchainConfiguration', config.BLOCKCHAIN_STATUSES.TO_FETCH)
    }
  })
})

app.setAsDefaultProtocolClient('zbay')

export const sleep = async (time = 1000) =>
  await new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })

app.on('before-quit', async e => {
  e.preventDefault()
  if (tor !== null) {
    await tor.kill()
  }
  // Killing worker takes couple of sec
  await client.terminate()
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
