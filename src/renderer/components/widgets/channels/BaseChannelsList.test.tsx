import React from 'react'

import { BaseChannelsList } from './BaseChannelsList'
import { Contact } from '../../../store/handlers/contacts'
import { renderComponent } from '../../../testUtils/renderComponent'

describe('BaseChannelsList', () => {
  it('renders component', () => {
    const channels = [new Contact()]
    const unknownMessages = [new Contact()]
    const directMessages = false
    const result = renderComponent(
      <BaseChannelsList
        channels={channels}
        unknownMessages={unknownMessages}
        directMessages={directMessages}
        selected={{}}
      />
    )
    expect(result.baseElement).toMatchSnapshot()
  })
})
