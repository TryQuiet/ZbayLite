import {fixture, test, Selector} from 'testcafe'

fixture `Electron test`
    .page('../dist/src/main/index.html#/');

test('User can create new community and register', async t => {
    console.log('Starting test')
    const continueButton = await Selector('button', {visibilityCheck: true, timeout: 50000}).withText("Continue")()
    // console.log('Button', continueButton)
    await t.expect(continueButton).ok('Continue button is not visible')
    const createCommunityLink = Selector('a').withAttribute('data-testid', 'JoinCommunityLink')
    await t.click(createCommunityLink)

    const createCommunityTitle = await Selector('h3').withText('Create your community')()
    await t.expect(createCommunityTitle).ok()
    const continueButton2 = Selector('button').withText("Continue")
    const communityNameInput = Selector('input').withAttribute('placeholder', 'Community name')
    // console.log('--->', communityNameInput)

    // console.log('->', input)
    await t.typeText(communityNameInput, 'testcommunity')
    await t.click(continueButton2)

    //
    const registerUsernameTitle = await Selector('h3').withText('Register a username')()
    await t.expect(registerUsernameTitle).ok()
    const usernameInput = Selector('input').withAttribute('name', 'userName').filterVisible()
    const submitButton = Selector('button').withText("Register")

    await t.expect(usernameInput.exists).ok()
    await t.typeText(usernameInput, 'testuser')
    await t.click(submitButton)
    await t.debug()

    // wait for the spinner to disappear
    // await t.expect(Selector('span').withText('Creating community').exists).notOk('"Creating community" spinner should disappear', { timeout: 25000 })
    
    await t.expect(Selector('h5').withText('#general').exists).ok('User sees "general" channel', {timeout: 25000})
    // wait for h5 '#general'
    // h4 '<nickname>'
    // take a screenshot?
    console.log('AFTER')
})