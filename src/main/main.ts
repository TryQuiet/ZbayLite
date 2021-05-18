import { app, BrowserWindow, Menu, ipcMain, session } from 'electron'
import electronLocalshortcut from 'electron-localshortcut'
import path from 'path'
import url from 'url'
import { autoUpdater } from 'electron-updater'

import config from './config'
import electronStore from '../shared/electronStore'
import Client from './cli/client'
import websockets, { clearConnections } from './websockets/client'
import { createServer } from './websockets/server'
import { getOnionAddress, spawnTor, runWaggle } from './waggleManager'

electronStore.set('appDataPath', app.getPath('appData'))
electronStore.set('waggleInitialized', false)

export const isDev = process.env.NODE_ENV === 'development'

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

const extensionsFolderPath = `${app.getPath('userData')}/extensions`

const applyDevTools = async () => {
  /* eslint-disable */
  if (!isDev) return
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
  await Promise.all(extensionsData.map(async (extension) => {
    await installer.default(extension.name)
  }))
  await Promise.all(extensionsData.map(async (extension) => {
    await session.defaultSession.loadExtension(extension.path, { allowFileAccess: true })
  }))
}

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
      hash: '/zcashNode'
    })
  )
  /* eslint-enable */
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
  electronLocalshortcut.register(mainWindow, 'F12', () => {
    mainWindow.webContents.openDevTools()
  })
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

  await applyDevTools()

  await createWindow()
  mainWindow.webContents.on('did-finish-load', async () => {
    mainWindow.webContents.send('ping')
    try {
      tor = await spawnTor()
      createServer(mainWindow)
      mainWindow.webContents.send('onionAddress', getOnionAddress())
      mainWindow.webContents.send('connectWsContacts')
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
      mainWindow.webContents.send('connectWsContacts')
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

  ipcMain.on('sendWebsocket', async (_event, arg) => {
    const request = JSON.parse(arg)
    const response = await websockets.handleSend(request)
    // const response = await client.postMessage(request.id, request.method, request.args)
    if (mainWindow) {
      mainWindow.webContents.send(
        'sendWebsocket',
        JSON.stringify({ id: request.id, response: response })
      )
    }
  })

  ipcMain.on('initWsConnection', async (_event, arg) => {
    const request = JSON.parse(arg)
    try {
      const socket = await websockets.connect(request.address)
      if (mainWindow) {
        mainWindow.webContents.send(
          'initWsConnection',
          JSON.stringify({ id: request.id, connected: true })
        )
      }
      // socket
      socket.on('close', function () {
        if (mainWindow) {
          mainWindow.webContents.send(
            'initWsConnection',
            JSON.stringify({ id: request.id, connected: false })
          )
        }
      })
    } catch (error) {
      console.log(error)
      if (mainWindow) {
        mainWindow.webContents.send(
          'initWsConnection',
          JSON.stringify({ id: request.id, connected: false })
        )
      }
    }
    // const response = await client.postMessage(request.id, request.method, request.args)
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
  clearConnections()
  await sleep(2000)
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
