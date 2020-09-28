import { client as WSClient } from 'websocket'
import url from 'url'
import { HttpsProxyAgent } from 'https-proxy-agent'
var proxy = 'http://localhost:9080'
var endpoint =
  'ws://qow7lnr5knkhea336336vrfh34iuxapsciglnp7x3tww4p7idxoospad.onion'

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
