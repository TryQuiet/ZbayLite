import {fixture, test, Selector} from 'testcafe'

fixture `Electron test`
    .page('../dist/src/main/index.html#/');

test('Application starts', async t => {
    console.log('Starting test')
    const continueButton = await Selector('button', {visibilityCheck: true, timeout: 50000}).withText("Continue")()
    console.log('Button', continueButton)
    await t.expect(continueButton).ok('Continue button is not visible')
    // console.log(continueButton)
    const input = await Selector('input', { visibilityCheck: true, timeout: 1000 })()
    console.log('->', input)
    // await t.expect(input)
    await t.typeText(input, 'link')
    await t.click(continueButton)
    // await t.expect(getPageTitle()).eql("Hello Electron React!");
    console.log('AFTER')
})