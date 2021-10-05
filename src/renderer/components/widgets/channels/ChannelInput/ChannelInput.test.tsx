import React from 'react'

import { INPUT_STATE } from '../../../../store/selectors/channel'

import { renderComponent } from '../../../../testUtils/renderComponent'
import { ChannelInput } from './ChannelInput'

describe('ChannelInput', () => {
  it('renders component input available ', () => {
    const result = renderComponent(
      <ChannelInput
        onChange={jest.fn()}
        onKeyPress={jest.fn()}
        message='This is just a test message'
        inputState={INPUT_STATE.AVAILABLE}
        channelName={'test'}
        users={{}}
        inputPlaceholder='test'
        isMessageTooLong={false}
        infoClass={''}
        setInfoClass={jest.fn()}
        id={''}
      />
    )
    expect(result.baseElement).toMatchInlineSnapshot()
  })
})
