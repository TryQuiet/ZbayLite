import React from 'react'

import { renderComponent } from '../../../testUtils/renderComponent'
import { ChannelHeaderComponent } from './ChannelHeader'

describe('ChannelHeader', () => {
  it('renders component', () => {
    const result = renderComponent(
      <ChannelHeaderComponent
        channel={{
          name: 'general',
          description: 'description',
          owner: 'holmes',
          timestamp: 0,
          address: 'address'
        }}
        onInfo={jest.fn()}
        onDelete={jest.fn()}
        onSettings={jest.fn()}
        mutedFlag={false}
        notificationFilter={''}
        openNotificationsTab={jest.fn()}
      />
    )
    expect(result.baseElement).toMatchInlineSnapshot()
  })
})
