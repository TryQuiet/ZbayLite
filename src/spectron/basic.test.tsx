import { waitFor } from '@testing-library/dom'
import { writeFileSync } from 'fs'
import path from 'path'
import { Application } from 'spectron'
console.log('_____', __dirname)
jest.setTimeout(50_000)



const startApp = async (): Promise<Application> => {
  const app = new Application({
    path: path.join(__dirname, 'Zbay-4.0.0-zbay-lite.AppImage'),
    env: {
      'DEBUG': 'waggle:*'
    }
  })
  console.log('Starging...')
  return await app.start()
}

describe('Zbay', () => {
  let app = null;
  
  beforeEach(async () => {
    console.log('BEFORE START')
    app = await startApp()
    console.log('set app')
    // await waitFor(() => expect(app).not.toBeNull())
    console.log('AFTER START')
  })

  afterEach(async () => {
    console.log('Aftereach')
    if (app) {
      console.log('999999')
      return await app.stop();
    }
    console.log('90909090')
  })

  it('starts up and shows registration form', async () => {
    // console.log('-----', app)
    // await app.client.getWindowHandles();
    await app.client.waitUntilWindowLoaded()
    // console.log('->', app.browserWindow)
    const isVisible = await app.browserWindow.isVisible()
    expect(isVisible).toEqual(true)
    const title = await app.client.getTitle()
    console.log('asdasdsa', title)
    expect(title).toEqual('Zbay')

    const screenshot = await app.browserWindow.capturePage()
    console.log('123')
    writeFileSync('loadingPage.png', screenshot)
    console.log('1234')
    const input = await app.client.$$('input[name="invite"]')
    console.log('12345')
    // await app.client.waitUntil(async () => {
    //   const nickNameInput = await app.client.$$('input[name="invite"]')
    //   return nickNameInput.length > 0
    // }, {timeout: 10000})
    expect(input).not.toBeNull()
    console.log('123456')
    console.log(app.client)
    console.log(app.client.getWindowCount())
    // await app.client.closeWindow()
    console.log('ddddd')
    // const button = await app.client.$('button=Continue')
    // expect(button).not.toHaveProperty('error')
    // writeFileSync('formPage.png',  await app.browserWindow.capturePage())
  })
})
