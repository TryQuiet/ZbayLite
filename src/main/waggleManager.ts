import TlgManager from 'waggle'
import fp from 'find-free-port'
import { BrowserWindow } from 'electron'
import electronStore from '../shared/electronStore'
import { ConnectionsManager } from 'waggle/lib/libp2p/connectionsManager'
import { DataServer } from 'waggle/lib/socket/DataServer'

export const getPorts = async (): Promise<{
  socksPort: number
  libp2pHiddenService: number
  controlPort: number
  httpTunnelPort: number
  dataServer: number
}> => {
  const [controlPort] = await fp(9151)
  const [httpTunnelPort] = await fp(9251)
  const [socksPort] = await fp(9052)
  const [libp2pHiddenService] = await fp(7950)
  const [dataServer] = await fp(4677)
  return {
    socksPort,
    libp2pHiddenService,
    controlPort,
    httpTunnelPort,
    dataServer
  }
}

export const runWaggle = async (webContents: BrowserWindow['webContents']): Promise<{ connectionsManager: ConnectionsManager; dataServer: DataServer }> => {
  const ports = await getPorts()

  const appDataPath = electronStore.get('appDataPath')

  const dataServer = new TlgManager.DataServer(ports.dataServer)
  await dataServer.listen()

  const isDev = process.env.NODE_ENV === 'development'
  const resourcesPath = isDev ? null : process.resourcesPath

  const connectionsManager = new TlgManager.ConnectionsManager({
    port: ports.libp2pHiddenService,
    agentHost: 'localhost',
    agentPort: ports.socksPort,
    httpTunnelPort: ports.httpTunnelPort,
    io: dataServer.io,
    options: {
      env: {
        appDataPath: `${appDataPath}/Zbay`,
        resourcesPath
      },
      spawnTor: true,
      torControlPort: ports.controlPort
    }
  })

  await connectionsManager.init()

  webContents.send('connectToWebsocket', { dataPort: ports.dataServer })

  return { connectionsManager, dataServer }
}

export const waggleVersion = TlgManager.version

export default { getPorts, runWaggle, waggleVersion }
