import React from 'react'

import { renderComponent } from '../../../../testUtils/renderComponent'
import { MentionElement } from './MentionElement'

describe('MentionElement', () => {
  it('renders component highlight', () => {
    const result = renderComponent(
      <MentionElement
        onClick={jest.fn()}
        onMouseEnter={jest.fn()}
        name='test'
        channelName='#test'
        participant
        highlight
      />
    )
    expect(result.baseElement).toMatchInlineSnapshot()
  })
  it('renders component not highlight', () => {
    const result = renderComponent(
      <MentionElement
        onClick={jest.fn()}
        onMouseEnter={jest.fn()}
        name='test'
        channelName='#test'
        participant
        highlight={false}
      />
    )
    expect(result.baseElement).toMatchInlineSnapshot()
  })
})
