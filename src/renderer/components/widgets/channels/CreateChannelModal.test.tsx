import React from 'react'
import { shallow } from 'enzyme'

import { CreateChannelModal } from './CreateChannelModal'

describe('CreateChannelModal', () => {
  it('renders component', () => {
    const result = shallow(
      <CreateChannelModal
        handleClose={jest.fn()}
        open
      />
    )
    expect(result).toMatchSnapshot()
  })

  it('renders closed component', () => {
    const result = shallow(
      <CreateChannelModal
        handleClose={jest.fn()}
        open={false}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
