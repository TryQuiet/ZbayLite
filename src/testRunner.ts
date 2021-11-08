import { spawn } from "child_process"

export default class TestDriver {
    rpcCalls: any[]
    process: any
    isReady: any

    constructor ({ path, args, env }) {
      this.rpcCalls = []
  
      // start child process
      env.APP_TEST_DRIVER = 1 // let the app know it should listen for messages
      // this.process = spawn('npm run start', args, { stdio: ['inherit', 'inherit', 'inherit', 'ipc'], env })
      this.process = spawn(path, args, { stdio: ['inherit', 'inherit', 'inherit', 'ipc'], env })
      console.log(this.process)

      // handle rpc responses
      this.process.on('message', (message) => {
        console.log('on message')
        // pop the handler
        const rpcCall = this.rpcCalls[message.msgId]
        if (!rpcCall) return
        this.rpcCalls[message.msgId] = null
        // reject/resolve
        if (message.reject) rpcCall.reject(message.reject)
        else rpcCall.resolve(message.resolve)
      })
  
      // wait for ready
      this.isReady = this.rpc('isReady').then(() => {
        console.log('App is ready')
        return true
      }).catch((err) => {
        console.error('Application failed to start', err)
        this.stop()
        process.exit(1)
      }).finally(()=> console.log('...'))
    }
  
    // simple RPC call
    // to use: driver.rpc('method', 1, 2, 3).then(...)
    async rpc (cmd, ...args) {
      console.log('RPC start')
      // send rpc request
      const msgId = this.rpcCalls.length
      this.process.send({ msgId, cmd, args })
      console.log('RPC end')
      return new Promise((resolve, reject) => this.rpcCalls.push({ resolve, reject }))
    }
  
    stop () {
      this.process.kill()
    }
  }