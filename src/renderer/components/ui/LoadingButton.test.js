/* eslint import/first: 0 */
import React from 'react'
import { shallow } from 'enzyme'

import { LoadingButton } from './LoadingButton'

describe('Loading button', () => {
  it('renders component', () => {
    const props = {
      inProgress: false
    }
    const result = shallow(
      <LoadingButton
        props={props}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
