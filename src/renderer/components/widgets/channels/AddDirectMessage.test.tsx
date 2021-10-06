import React from 'react'

import { AddDirectMessage } from './AddDirectMessage'
import { renderComponent } from '../../../testUtils/renderComponent'

describe('AddDirectMessage', () => {
  it('renders component', () => {
    const openModal = jest.fn()
    const result = renderComponent(
      <AddDirectMessage openModal={openModal} />)
    expect(result.baseElement).toMatchInlineSnapshot()
  })
})
