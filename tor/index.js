const path = require('path')
const isDev = process.env.NODE_ENV === 'development'
const pathDev = path.join.apply(null, [process.cwd(), 'tor/tor'])
const pathDevSettings = path.join.apply(null, [process.cwd(), 'tor/torrc'])
const pathProd = path.join.apply(null, [process.resourcesPath, 'tor/tor'])
const pathProdSettings = path.join.apply(null, [
  process.resourcesPath,
  'tor/torrcProd'
])
const spawn = require('child_process').spawn
const spawnTor = () =>
  new Promise((resolve, reject) => {
    const proc = spawn(isDev ? pathDev : pathProd, [
      '-f',
      isDev ? pathDevSettings : pathProdSettings
    ])
    const id = setTimeout(() => {
      resolve(null)
    }, 8000)
    proc.stdout.on('data', data => {
      console.log(`stdout: ${data}`)
      if (data.includes('100%')) {
        console.log(data)
        clearTimeout(id)
        resolve(proc)
      }
    })
    proc.stderr.on('data', data => {
      console.error(`grep stderr: ${data}`)
    })
    proc.on('close', code => {
      if (code !== 0) {
        console.log(`ps process exited with code ${code}`)
      }
    })
  })
const getOnionAddress = () => {
  const pathDev = path.join.apply(null, [
    process.cwd(),
    'tor/hidden_service/hostname'
  ])
  const pathProd = path.join.apply(null, [
    process.resourcesPath,
    'tor/hidden_serviceProd/hostname'
  ])
  var fs = require('fs')
  const address = fs.readFileSync(isDev ? pathDev : pathProd, 'utf8')
  return address
}
module.exports = { spawnTor, getOnionAddress }
