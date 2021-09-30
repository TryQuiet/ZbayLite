import React from 'react'
import { shallow } from 'enzyme'
import BigNumber from 'bignumber.js'
import { SyncLoader } from './SyncLoader'

describe('SyncLoader', () => {
  it('renders component', () => {
    const result = shallow(
      <SyncLoader
        currentBlock={new BigNumber(1)}
        latestBlock={new BigNumber(1000)}
        getStatus={jest.fn()}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
