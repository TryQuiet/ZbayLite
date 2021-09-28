
import React from 'react'
import { connect } from 'react-redux'

import NodePanelField from '../../../components/widgets/node/NodePanelField'

// import nodeSelectors from '../../../store/selectors/node'

export const mapStateToProps = _state => ({
  // latestBlock: nodeSelectors.latestBlock(state),
  // currentBlock: nodeSelectors.currentBlock(state)
})

export const NodePanelBlocksField = ({ latestBlock = 0, currentBlock = 0 }) => {
  return <NodePanelField name='Blocks' value={`${currentBlock.toString()} / ${latestBlock.toString()}`} />
}

export default connect(mapStateToProps)(NodePanelBlocksField)
