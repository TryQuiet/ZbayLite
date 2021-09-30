/* eslint import/first: 0 */
import React from 'react'
import { shallow } from 'enzyme'

import { UsernameCreated } from './UsernameCreated'

describe('UsernameCreated', () => {
  it('renders component', () => {
    const result = shallow(
      <UsernameCreated
        handleClose={jest.fn()}
        setFormSent={jest.fn()}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
