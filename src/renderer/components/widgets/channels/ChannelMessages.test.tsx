import React from 'react'
import { DateTime } from 'luxon'

import { now } from '../../../testUtils'
import { ChannelMessages } from './ChannelMessages'
import { renderComponent } from '../../../testUtils/renderComponent'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../../../store'

describe('ChannelMessages', () => {
  it('renders component', async () => {
    const message = {
      id: 'string',
      type: 1,
      message: 'string',
      createdAt: 'string',
      nickname: 'string'
    }

    jest.spyOn(DateTime, 'utc').mockImplementationOnce(() => now)
    const messages = [message]
    const contentRect = {
      bounds: {
        height: 200
      }
    }
    const result = renderComponent(
      <HashRouter>
        <Provider store={store}>
          <ChannelMessages
            messages={messages}
            contentRect={contentRect}
          />
        </Provider>
      </HashRouter>
    )
    expect(result.baseElement).toMatchInlineSnapshot()
  })
})
