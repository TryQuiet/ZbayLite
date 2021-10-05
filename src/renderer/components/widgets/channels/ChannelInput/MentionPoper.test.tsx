import React from 'react'

import { renderComponent } from '../../../../testUtils/renderComponent'
import { MentionPoper } from './MentionPoper'

describe('MentionPoper', () => {
  it('renders component highlight', () => {
    const anchor: HTMLDivElement = document.createElement('div')
    const result = renderComponent(
      <MentionPoper anchorEl={anchor} selected={1}>
        <div />
        <div />
        <div />
      </MentionPoper>
    )
    expect(result.baseElement).toMatchInlineSnapshot()
  })
})
