const { parentPort } = require('worker_threads')
const Client = require('./RPC')
let _client = null

parentPort.on('message', async data => {
  try {
    const request = JSON.parse(data)
    if (request.method === 'init') {
      console.log(request)
      if (request.seed) {
        _client = new Client(request.seed, request.birthday)
      } else {
        _client = new Client()
      }
      parentPort.postMessage(JSON.stringify({ id: request.id }))
    } else {
      const method = _client[request.method]
      const tx = await method(request.args)
      parentPort.postMessage(JSON.stringify({ id: request.id, data: tx }))
    }
  } catch (error) {
    console.log(error)
  }
})
