const path = require('path')
const pathDev = path.join.apply(null, [process.cwd(), 'tor/tor'])
const pathSettings = path.join.apply(null, [process.cwd(), 'tor/torrc'])
console.log(pathDev)
console.log(pathSettings)
const spawn = require('child_process').spawn

const spawnTor = () =>
  new Promise((resolve, reject) => {
    const proc = spawn(pathDev, ['-f', pathSettings])
    const id = setTimeout(() => {
      resolve(-1)
    }, 5000)
    proc.stdout.on('data', data => {
      console.log(`stdout: ${data}`)
      if (data.includes('100%')) {
        console.log(data)
        clearTimeout(id)
        resolve(1)
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

  var fs = require('fs')
  const address = fs.readFileSync(pathDev, 'utf8')
  return address
}
module.exports = { spawnTor, getOnionAddress }
