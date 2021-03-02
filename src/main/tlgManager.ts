import TlgManager from 'waggle'
import fp from 'find-free-port'
import fs from 'fs'
import path from 'path'
import os from 'os'
import electronStore from '../shared/electronStore'

const isDev = process.env.NODE_ENV === 'development'

const pathDev = path.join.apply(null, [process.cwd(), 'tor', 'tor'])
const pathDevLib = path.join.apply(null, [process.cwd(), 'tor'])
const pathProdLib = path.join.apply(null, [process.resourcesPath, 'tor'])
const pathDevSettings = path.join.apply(null, [process.cwd(), 'tor', 'torrc'])
const pathProd = path.join.apply(null, [process.resourcesPath, 'tor', 'tor'])
const pathProdSettingsTemplate = path.join.apply(null, [process.resourcesPath, 'tor', 'torrc'])

export const spawnTor = async () => {
  const ports = await getPorts()
  electronStore.set('ports', ports)
  const data = fs
    .readFileSync(isDev ? pathDevSettings : pathProdSettingsTemplate)
    .toString()
    .split('\n')
  data.splice(
    17,
    1,
    `SocksPort ${ports.socksPort} # Default: Bind to localhost:9050 for local connections.`
  )
  data.splice(18, 1, `HTTPTunnelPort ${ports.httpTunnelPort}`)
  let text = data.join('\n')
  text = text.replace(/PATH_TO_CHANGE/g, path.join.apply(null, [os.homedir(), 'zbay_tor']))
  fs.writeFileSync(
    isDev ? pathDevSettings : path.join.apply(null, [os.homedir(), 'torrc']),
    text,
    'utf8'
  )
  const tor = new TlgManager.Tor({
    torPath: isDev ? pathDev : pathProd,
    settingsPath: isDev ? pathDevSettings : path.join.apply(null, [os.homedir(), 'torrc']),
    options: {
      env: {
        LD_LIBRARY_PATH: isDev ? pathDevLib : pathProdLib,
        HOME: os.homedir()
      }
    }
  })
  await tor.init()
  console.log('before adding git service')
  //const serviceAddressGit = await tor.addService({ port: 9418 })
  const serviceAddressLibp2p = await tor.addService({ port: ports.libp2pHiddenService })
  electronStore.set('onionAddresses', {
    //serviceAddressGit,
    serviceAddressLibp2p
  })
  tor.process.stderr.on('data', data => {
    console.error(`grep stderr: ${data}`)
  })
  tor.process.on('close', code => {
    if (code !== 0) {
      console.log(`ps process exited with code ${code}`)
    }
  })
  return tor
}

export const getPorts = async (): Promise<{
  socksPort: number
  httpTunnelPort: number
  libp2pHiddenService: number
}> => {
  const [socksPort] = await fp(9052)
  const [httpTunnelPort] = await fp(9082)
  const [libp2pHiddenService] = await fp(7950)
  return {
    socksPort,
    httpTunnelPort,
    libp2pHiddenService
  }
}

export const getOnionAddress = (): string => {
  const address: string = fs.readFileSync(
    path.join.apply(null, [os.homedir(), 'zbay_tor/hostname']),
    'utf8'
  )
  return address
}

export const runLibp2p = async (webContents): Promise<any> => {
  const ports = electronStore.get('ports')

  const { serviceAddressLibp2p } = electronStore.get('onionAddresses')
  const connectonsManager = new TlgManager.ConnectionsManager({
    port: ports.libp2pHiddenService,
    host: serviceAddressLibp2p.address,
    agentHost: 'localhost',
    agentPort: ports.socksPort
  })
  await connectonsManager.initializeNode()
  const dataServer = new TlgManager.DataServer()
  dataServer.listen()
  TlgManager.initListeners(dataServer.io, connectonsManager)
  webContents.send('connectToWebsocket')
}

export default { spawnTor, getOnionAddress, getPorts, runLibp2p }
