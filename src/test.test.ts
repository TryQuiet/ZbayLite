// const electronPath = require('electron')
import { waitFor } from '@testing-library/dom'
import getElectronPath from 'electron/index'
import TestDriver from './testRunner'
jest.setTimeout(10_000)

console.log(getElectronPath, '<<<')
const app = new TestDriver({
  path: getElectronPath,
  args: ['.'],
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
})

describe('Zbay app', () => {
  beforeEach(async () => {
    console.log('isReady')
    await app.isReady
    console.log('isReady--')
  })

  it('starts without error', async () => {
    console.log('test...')
    await waitFor(() => expect(app.isReady).resolves.toBe(true))
  })

  afterEach(async () => {
    console.log('stopping...')
    app.stop()
  })
})