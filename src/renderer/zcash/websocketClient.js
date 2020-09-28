import { ipcRenderer } from 'electron'

var endpoint =
  'ws://qow7lnr5knkhea336336vrfh34iuxapsciglnp7x3tww4p7idxoospad.onion'
let counter = 0
var mapping = new Map()
export const sendMessage = async (message, address = endpoint) => {
  const promise = new Promise((resolve, reject) => {
    mapping.set(counter, {
      resolve: resolve,
      data: JSON.stringify({
        id: counter,
        message: message,
        endpoint: endpoint
      })
    })
  })
  ipcRenderer.send(
    'sendWebsocket',
    JSON.stringify({ id: counter, message: message, endpoint: endpoint })
  )
  counter++
  return promise
}

ipcRenderer.on('sendWebsocket', (e, d) => {
  const data = JSON.parse(d)
  mapping.get(data.id).resolve(data.response)
  mapping.delete(data.id)
})
