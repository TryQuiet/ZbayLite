// import { Worker } from 'worker_threads'
/* eslint-disable */
import { Worker as NodeWorker } from 'worker_threads'
import path from 'path'
import Worker from './cli.worker.js'
class MockWorker {
  constructor (a) {
    return new NodeWorker(
      process.env.NODE_ENV === 'development'
        ? path.resolve(__dirname, `./${a}`)
        : `./${a}`
    )
  }
}
global.Worker = MockWorker
const worker = new Worker()
var mapping = new Map()
export default class Client {
  constructor () {
    worker.on('message', d => {
      const args = JSON.parse(d)
      mapping.get(args.id).resolve(args.data)
      mapping.delete(args.id)
    })
  }
  postMessage = async (id, method, args = '') => {
    const promise = new Promise((resolve, reject) => {
      mapping.set(id, {
        resolve: resolve,
        args: JSON.stringify({ id: id, method: method, args: args })
      })
    })
    worker.postMessage(JSON.stringify({ id: id, method: method, args: args }))
    return promise
  }
}
