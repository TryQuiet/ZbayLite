import React from 'react'
import { shallow } from 'enzyme'

import { Loading } from './Loading'

describe('Loading', () => {
  it('renders component', () => {
    const result = shallow(<Loading message='test Msg' />)
    expect(result).toMatchSnapshot()
  })
})
