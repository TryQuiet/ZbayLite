import React from 'react'
import { Provider } from 'react-redux'

import { ChannelContent } from './ChannelContent'
import { CHANNEL_TYPE } from '../../pages/ChannelTypes'
import { renderComponent } from '../../../testUtils/renderComponent'
import { Mentions } from '../../../store/handlers/mentions'
import store from '../../../store'
import { DateTime } from 'luxon'
import { now } from '../../../testUtils'


describe('ChannelContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(DateTime, 'utc').mockImplementationOnce(() => now)
  })

  it('renders component', () => {
    const mentions = { channelId: [new Mentions({ nickname: '', timeStamp: 100000 })] }
    const result = renderComponent(
      <Provider store={store}>
        <ChannelContent
          channelType={CHANNEL_TYPE.NORMAL}
          measureRef={jest.fn()}
          contentRect={''}
          mentions={mentions}
          sendInvitation={jest.fn()}
          removeMention={jest.fn()}
          inputState={''}
          contactId={''}
          signerPubKey={''}
          offer={''}
          tab={jest.fn()}
        />
      </Provider>
    )
    expect(result.baseElement).toMatchInlineSnapshot()
  })
})
