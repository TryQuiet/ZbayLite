/* eslint import/first: 0 */
import React from 'react'
import { shallow } from 'enzyme'

import { Index } from './Index'

describe('Index', () => {
  it('renders component', () => {
    const result = shallow(<Index bootstrapping
      bootstrappingMessage='Launching node' />)
    expect(result).toMatchSnapshot()
  })

  it('renders when bootstrapping', () => {
    const result = shallow(
      <Index
        bootstrapping
        bootstrappingMessage='Launching node'
      />
    )
    expect(result).toMatchSnapshot()
  })
})
