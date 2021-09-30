import React from 'react'
import { shallow } from 'enzyme'

import { SpentFilter } from './SpentFilter'

describe('SpentFilter', () => {
  it('renders component', () => {
    const result = shallow(
      <SpentFilter
        value={20}
        handleOnChange={jest.fn()}
      />
    )
    expect(result).toMatchSnapshot()
  })

  it('renders component when max/inf', () => {
    const result = shallow(
      <SpentFilter
        value={-1}
        handleOnChange={jest.fn()}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
