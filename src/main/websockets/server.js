var WebSocket = require('ws')

export const createServer = mainWindow => {
  const wsServer = new WebSocket.Server({
    port: 3435,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: true
  })
  wsServer.on('connection', function (socket, request, client) {
    console.log('New connection')
    console.log('crazy connection')
    console.log('stringi')
    console.log(`request ${JSON.stringify(request)}`)
    console.log('')
    console.log(`client ${client}`)
    socket.on('open', function (event) {
      console.log('socket opened')
    })
    socket.on('message', function (message) {
      console.log(message)
      mainWindow.webContents.send('wsMessage', message)
    })
    socket.on('close', function (message) {
      console.log('disconnected')
      socket.close()
    })
  })
  console.log('websocket server running')
}
