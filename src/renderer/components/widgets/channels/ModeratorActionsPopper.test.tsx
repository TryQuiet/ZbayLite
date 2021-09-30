import React from 'react'
import { shallow } from 'enzyme'
import { ReferenceObject } from 'popper.js'

import { ModeratorActionsPopper } from './ModeratorActionsPopper'

describe('ModeratorActionsPopper', () => {
  it('renders', () => {
    const reactRef = {
      clientHeight: 1,
      clientWidth: 1,
      getBoundingClientRect: {}
    }
    const result = shallow(
      <ModeratorActionsPopper
        name='123'
        address='123'
        open
        anchorEl={reactRef as ReferenceObject}
        banUser={jest.fn()}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
