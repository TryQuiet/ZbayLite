import React from 'react'

import { ChannelInputComponent } from './ChannelInput'
import { renderComponent } from '../../../../testUtils/renderComponent'

describe('ChannelInput', () => {
  it('renders component input available ', () => {
    const result = renderComponent(
      <ChannelInputComponent
        channelAddress={'channelAddress'}
        channelName={'channelName'}
        inputPlaceholder='#channel as @user'
        onChange={jest.fn()}
        onKeyPress={jest.fn()}
        infoClass={''}
        setInfoClass={jest.fn()}
      />
    )
    expect(result.baseElement).toMatchInlineSnapshot()
  })
})
