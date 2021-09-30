/* eslint import/first: 0 */
import React from 'react'
import { shallow } from 'enzyme'
import { Security } from './Security'

describe('Security', () => {
  it('renders component', () => {
    const result = shallow(
      <Security
        openSeedModal={jest.fn()}
        allowAll={true}
        toggleAllowAll={jest.fn()}
        isRescanned={true}
        onRescan={jest.fn()}
        whitelisted={[]}
        removeSiteHost={jest.fn()}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
