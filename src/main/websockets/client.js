var WebSocketClient = require('ws')
var url = require('url')
var HttpsProxyAgent = require('https-proxy-agent')
var proxy = 'http://localhost:9080'

const connections = new Map()

export const connect = address =>
  new Promise((resolve, reject) => {
    const options = url.parse(proxy)
    const agent = new HttpsProxyAgent(options)
    const socket = new WebSocketClient(address, { agent: agent })
    const id = setTimeout(() => {
      // eslint-disable-next-line
      reject('timeout')
    }, 6000)
    socket.on('open', function (a) {
      console.log('connected')
      clearTimeout(id)
      resolve(socket)
    })
    socket.on('close', function () {
      console.log('delete')
      console.log(connections)

      connections.delete(address)
      console.log(connections)
    })
  })

export const handleSend = async ({ message, endpoint }) => {
  try {
    if (!connections.get(endpoint)) {
      const connection = await connect(endpoint)
      connections.set(endpoint, connection)
      connection.send(message)
    } else {
      connections.get(endpoint).send(message)
    }
    return 1
  } catch (error) {
    return -1
  }
}
export default { handleSend, connect }
