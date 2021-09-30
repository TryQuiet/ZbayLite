/* eslint import/first: 0 */
import React from 'react'
import { shallow } from 'enzyme'

import { MessagesDivider } from './MessagesDivider'

describe('MessagesDivider', () => {
  it('renders component', () => {
    const result = shallow(
      <MessagesDivider title='test' />
    )
    expect(result).toMatchSnapshot()
  })
})
