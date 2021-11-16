import React from 'react'
import { renderComponent } from '../../../testUtils/renderComponent'
import { now } from '../../../testUtils'
import { DateTime } from 'luxon'
import { ChannelMessagesComponent } from './ChannelMessages'

describe('ChannelMessages', () => {
  it('renders component', async () => {

    const message = {
      id: 'string',
      type: 1,
      message: 'string',
      createdAt: '1636995488.44',
      nickname: 'string'
    }

    jest.spyOn(DateTime, 'utc').mockImplementationOnce(() => now)

    const messages = [message]

    const result = renderComponent(
      <ChannelMessagesComponent channel={'general'} messages={messages} />
    )
    
    expect(result.baseElement).toMatchInlineSnapshot()
  })
})
