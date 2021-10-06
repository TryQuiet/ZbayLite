import React from 'react'
import { renderComponent } from '../../testUtils/renderComponent'
import BigNumber from 'bignumber.js'
import { SyncLoader } from './SyncLoader'

describe('SyncLoader', () => {
  it('renders component', () => {
    const result = renderComponent(
      <SyncLoader
        currentBlock={new BigNumber(1)}
        latestBlock={new BigNumber(1000)}
        getStatus={jest.fn()}
      />
    )
    expect(result.baseElement).toMatchInlineSnapshot()
  })
})
