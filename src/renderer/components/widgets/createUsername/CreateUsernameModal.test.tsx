/* eslint import/first: 0 */
import React from 'react'
import { renderComponent } from '../../../testUtils/renderComponent'

import { CreateUsernameModal } from './CreateUsernameModal'

describe('CreateUsernameModal', () => {
  it('renders component', () => {
    const result = renderComponent(
      <CreateUsernameModal
        handleClose={jest.fn()}
        initialValue={{
          nickname: 'test'
        }}
      />
    )
    expect(result.baseElement).toMatchInlineSnapshot()
  })
})
