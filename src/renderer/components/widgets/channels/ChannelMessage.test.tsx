import React from 'react'
import { DateTime } from 'luxon'

import { ChannelMessage } from './ChannelMessage'
import { now } from '../../../testUtils'
import { renderComponent } from '../../../testUtils/renderComponent'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../../../store'

describe('ChannelMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(DateTime, 'utc').mockImplementationOnce(() => now)
  })

  it('renders component', async () => {
    const message = {
      id: 'string',
      type: 1,
      message: 'string',
      createdAt: 'string',
      nickname: 'string'
    }

    const result = renderComponent(
      <HashRouter>
        <Provider store={store}>
          <ChannelMessage
            message={message}
            onResend={jest.fn()}
            onLinkedChannel={jest.fn()}
            onLinkedUser={jest.fn()}
            openExternalLink={jest.fn()}
            setWhitelistAll={jest.fn()}
            addToWhitelist={jest.fn()}
            publicChannels={{}}
            users={{}}
            whitelisted={[]}
            autoload={[]}
            allowAll={false}
            torEnabled={true}
          />
        </Provider>
      </HashRouter>
    )
    expect(result.baseElement).toMatchInlineSnapshot()
  })
  it('renders component when message is sent by owner', async () => {
    const message = {
      id: 'string',
      type: 1,
      message: 'string',
      createdAt: 'string',
      nickname: 'string'
    }

    const result = renderComponent(
      <HashRouter>
        <Provider store={store}>
          <ChannelMessage
            message={message}
            onResend={jest.fn()}
            onLinkedChannel={jest.fn()}
            onLinkedUser={jest.fn()}
            openExternalLink={jest.fn()}
            setWhitelistAll={jest.fn()}
            addToWhitelist={jest.fn()}
            publicChannels={{}}
            users={{}}
            whitelisted={[]}
            autoload={[]}
            allowAll={false}
            torEnabled={true}
          />
        </Provider>
      </HashRouter>
    )
    expect(result.baseElement).toMatchInlineSnapshot()
  })
})
