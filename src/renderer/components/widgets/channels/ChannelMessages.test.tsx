import React from 'react'
import { DateTime } from 'luxon'

import { now, createMessage } from '../../../testUtils'
import { ChannelMessages } from './ChannelMessages'
import { DisplayableMessage } from '../../../zbay/messages.types'
import { renderComponent } from '../../../testUtils/renderComponent'

describe('ChannelMessages', () => {
  it('renders component', async () => {
    const message = await createMessage()
    const displayMessage = new DisplayableMessage(message)
    const displayMessageWithCreatedAtString = {
      ...displayMessage,
      createdAt: displayMessage.createdAt.toString()
    }

    jest.spyOn(DateTime, 'utc').mockImplementationOnce(() => now)
    const messages = [displayMessageWithCreatedAtString]
    const contentRect = {
      bounds: {
        height: 200
      }
    }
    const result = renderComponent(
      <ChannelMessages
        messages={messages}
        contentRect={contentRect}
      />
    )
    expect(result.baseElement).toMatchSnapshot()
  })
})
