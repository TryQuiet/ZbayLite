
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import NodePanelField from '../../../components/widgets/node/NodePanelField'

// import nodeSelectors from '../../../store/selectors/node'

export const mapStateToProps = _state => ({
  // network: nodeSelectors.network(state)
})

export const NodePanelNetworkField = ({ network }) => (
  <NodePanelField name='Network' value={network} />
)

NodePanelNetworkField.propTypes = {
  network: PropTypes.oneOf(['mainnet', 'testnet'])
}

export default connect(mapStateToProps)(NodePanelNetworkField)
