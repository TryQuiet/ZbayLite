import React from 'react'
import { DateTime } from 'luxon'

import { BasicMessage } from './BasicMessage'
import { now, createMessage } from '../../../testUtils'

import { DisplayableMessage } from '../../../zbay/messages.types'
import { renderComponent } from '../../../testUtils/renderComponent'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../../../store'

describe('BasicMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(DateTime, 'utc').mockImplementationOnce(() => now)
  })

  it('renders component', async () => {
    const message = await createMessage()
    const displayMessage = new DisplayableMessage(message)
    const result = renderComponent(
      <HashRouter>
        <Provider store={store}>
          <BasicMessage
            message={displayMessage}
            actionsOpen={false}
            setActionsOpen={jest.fn()}
            allowModeration
          />
        </Provider>
      </HashRouter>
    )
    expect(result.baseElement).toMatchInlineSnapshot()
  })

  it('renders component when message is sent by owner', async () => {
    const message = await createMessage()
    const messageFromYou = {
      ...message,
      fromYou: true
    }
    const displayMessage = new DisplayableMessage(messageFromYou)
    const result = renderComponent(
      <HashRouter>
        <Provider store={store}>
          <BasicMessage
            message={displayMessage}
            actionsOpen={false}
            setActionsOpen={jest.fn()}
            allowModeration
          />
        </Provider>
      </HashRouter>
    )
    expect(result.baseElement).toMatchInlineSnapshot()
  })
})
