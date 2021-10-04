import React from 'react'

import { renderComponent } from '../../../../testUtils/renderComponent'
import { MentionPoper } from './MentionPoper'

describe('MentionPoper', () => {
  it('renders component highlight', () => {
    const result = renderComponent(
      <MentionPoper anchorEl={React.createRef()} selected={1} />
    )
    expect(result.baseElement).toMatchInlineSnapshot()
  })
})
