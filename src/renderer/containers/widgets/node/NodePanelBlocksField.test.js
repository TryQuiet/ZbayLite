import React from 'react'
import { shallow } from 'enzyme'
import BigNumber from 'bignumber.js'

import { mapStateToProps, NodePanelBlocksField } from './NodePanelBlocksField'

import create from '../../../store/create'
import { NodeState } from '../../../store/handlers/node'

describe('NodePanelBlocksField', () => {
  let store = null
  beforeEach(() => {
    jest.clearAllMocks()
    store = create({
      node: {
        ...NodeState,
        latestBlock: new BigNumber(12345),
        currentBlock: new BigNumber(18)
      }
    })
  })

  it('will receive right props', async () => {
    const props = mapStateToProps(store.getState())
    expect(props).toMatchSnapshot()
  })

  it('renders the field', async () => {
    const result = shallow(
      <NodePanelBlocksField
        {...mapStateToProps(store.getState())}
      />
    )
    expect(result).toMatchSnapshot()
  })

  it('renders the field when no latestBlock', async () => {
    store = create({
      node: {
        ...NodeState,
        latestBlock: new BigNumber(0),
        currentBlock: new BigNumber(0)
      }
    })
    const result = shallow(
      <NodePanelBlocksField
        {...mapStateToProps(store.getState())}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
