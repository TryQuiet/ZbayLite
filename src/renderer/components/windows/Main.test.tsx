/* eslint import/first: 0 */
import React from 'react'
import { shallow } from 'enzyme'

import { Main } from './Main'

describe('Main', () => {
  it('renders component', () => {
    const result = shallow(<Main match={{ url: 'test' }} isLogWindowOpened={false} />)
    expect(result).toMatchSnapshot()
  })
})
