import { client as WSClient } from 'websocket'
import url from 'url'
import { HttpsProxyAgent } from 'https-proxy-agent'
var proxy = 'http://localhost:9080'
var endpoint =
  'ws://4vgnk45ts72fkqu6em5ldh3w3ka54rsqghe6ptvhslygeowdpirlpeid.onion'

export const connection = (
  address = endpoint,
  onClose = () => {
    console.log('closed')
  }
) =>
  new Promise((resolve, reject) => {
    const options = url.parse(proxy)
    const agent = new HttpsProxyAgent(options)
    console.log(WSClient)
    const socket = new WSClient()
    socket.connect(address, null, null, null, { agent: agent })
    const id = setTimeout(() => {
      // eslint-disable-next-line
      reject('timeout')
    }, 8000)
    socket.on('connect', function (connection) {
      console.log('connected')
      clearTimeout(id)
      connection.on('close', function () {
        onClose()
      })
      resolve(connection)
    })
  })
