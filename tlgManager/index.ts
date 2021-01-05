import TlgManager from 'tlg-manager'
import fp from 'find-free-port'
import fs from 'fs'
import path from 'path'
import os from 'os'
import * as child_process from 'child_process'
import electronStore from '../src/shared/electronStore'

const isDev = process.env.NODE_ENV === 'development'

const pathDev = path.join.apply(null, [process.cwd(), 'tor', 'tor'])
const pathDevLib = path.join.apply(null, [process.cwd(), 'tor'])
const pathProdLib = path.join.apply(null, [process.resourcesPath, 'tor'])
const pathDevSettings = path.join.apply(null, [process.cwd(), 'tor', 'torrc'])
const pathDevSettingsTemplate = path.join.apply(null, [process.cwd(), 'tor', 'newTorrcTest'])
const pathProd = path.join.apply(null, [process.resourcesPath, 'tor', 'tor'])
const pathProdSettings = path.join.apply(null, [process.resourcesPath, 'tor', 'newTorrcTest'])
const pathProdSettingsTemplate = path.join.apply(null, [
  process.resourcesPath,
  'tor',
  'newTorrcTest'
])

export const spawnTor = async () => {
  const ports = await getPorts()
  electronStore.set('ports', ports)
  fs.copyFileSync(
    isDev ? pathDevSettingsTemplate : pathProdSettingsTemplate,
    isDev ? pathDevSettings : pathProdSettings
  )
  const data = fs.readFileSync(isDev ? pathDevSettings : pathProdSettings, 'utf8')
  let result = data.replace(/PATH_TO_CHANGE/g, path.join.apply(null, [os.homedir(), 'zbay_tor']))
  result = result.replace(/SOCKS_PORT/g, ports.socksPort.toString())
  result = result.replace(/HTTP_TUNNEL_PORT/g, ports.httpTunnelPort.toString())
  fs.writeFileSync(
    isDev ? pathDevSettings : path.join.apply(null, [os.homedir(), 'torrc']),
    result,
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
  tor.process.stderr.on('data', data => {
    console.error(`grep stderr: ${data}`)
  })
  tor.process.on('close', code => {
    if (code !== 0) {
      console.log(`ps process exited with code ${code}`)
    }
  })
  return tor.process
}

export const getPorts = async (): Promise<{ socksPort: number, httpTunnelPort: number }> => {
  const [socksPort] = await fp(9052)
  const [httpTunnelPort] = await fp(9082)
  return {
    socksPort,
    httpTunnelPort
  }
}

export const getOnionAddress = (): string => {
  const address: string = fs.readFileSync(
    path.join.apply(null, [os.homedir(), 'zbay_tor/hostname']),
    'utf8'
  )
  return address
}

export const test = async (): Promise<void> => {
  console.log(TlgManager)
}

export default { spawnTor, getOnionAddress, getPorts }
