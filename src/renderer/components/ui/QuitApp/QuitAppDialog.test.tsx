import React from 'react'

import { renderComponent } from '../../../testUtils/renderComponent'
import { QuitAppDialog } from './QuitAppDialog'

describe('QuitAppDialog', () => {
  it('renders component', () => {
    const result = renderComponent(
      <QuitAppDialog open handleClose={jest.fn()} handleQuit={jest.fn()} />
    )

    expect(result).toMatchInlineSnapshot()
  })
})
