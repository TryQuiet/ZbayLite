/* eslint import/first: 0 */
import React from 'react'
import { shallow } from 'enzyme'

import { CreateUsernameModal } from './CreateUsernameModal'

describe('CreateUsernameModal', () => {
  it('renders component', () => {
    const result = shallow(
      <CreateUsernameModal
        handleClose={jest.fn()}
        initialValue={{
          nickname: 'test'
        }}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
