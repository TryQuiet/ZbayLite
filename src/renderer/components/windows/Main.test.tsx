/* eslint import/first: 0 */
import React from 'react'
import { renderComponent } from '../../testUtils/renderComponent'

import { Main } from './Main'

describe('Main', () => {
  it('renders component', () => {
    const result = renderComponent(
      <Main match={{ url: 'test' }} isLogWindowOpened={false} />)
    expect(result.baseElement).toMatchInlineSnapshot()
  })
})
