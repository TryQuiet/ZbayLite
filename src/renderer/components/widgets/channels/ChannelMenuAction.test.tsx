import React from 'react'

import { renderComponent } from '../../../testUtils/renderComponent'
import { ChannelMenuActionComponent } from './ChannelMenuAction'

describe('ChannelMenuAction', () => {
  it('renders component', () => {
    const result = renderComponent(
      <ChannelMenuActionComponent
        onInfo={jest.fn()}
        onMute={jest.fn()}
        onDelete={jest.fn()}
        onUnmute={jest.fn()}
        onSettings={jest.fn()}
        openNotificationsTab={jest.fn()}
        mutedFlag
        disableSettings
        notificationFilter={'1'}
      />
    )
    expect(result.baseElement).toMatchInlineSnapshot()
  })
})
