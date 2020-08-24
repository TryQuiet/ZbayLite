import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import vaultHandlers from '../../store/handlers/vault'
import nodeHandlers from '../../store/handlers/node'
import vaultSelectors from '../../store/selectors/vault'
import nodeSelectors from '../../store/selectors/node'
import identitySelectors from '../../store/selectors/identity'
import VaultUnlockerFormComponent from '../../components/widgets/VaultUnlockerForm'
import { actionCreators } from '../../store/handlers/modals'
// import { useInterval } from '../hooks'

export const mapStateToProps = state => ({
  isLogIn: vaultSelectors.isLogIn(state),
  locked: vaultSelectors.locked(state),
  loader: identitySelectors.loader(state),
  currentBlock: nodeSelectors.currentBlock(state),
  latestBlock: nodeSelectors.latestBlock(state),
  nodeConnected: nodeSelectors.isConnected(state),
  isRescanning: nodeSelectors.isRescanning(state),
  exists: vaultSelectors.exists(state),
  guideStatus: nodeSelectors.guideStatus(state)
})

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onSubmit: vaultHandlers.epics.unlockVault,
      getStatus: nodeHandlers.epics.getStatus,
      openModal: actionCreators.openModal('lightWalletSecurityModal')
    },
    dispatch
  )
export const VaultUnlockerForm = ({
  locked,
  getStatus,
  nodeConnected,
  isLogIn,
  exists,
  loader,
  openModal,
  guideStatus,
  ...props
}) => (
  <VaultUnlockerFormComponent
    locked={locked}
    loader={loader}
    exists={exists}
    openModal={openModal}
    nodeConnected={nodeConnected}
    isLogIn={isLogIn}
    guideStatus={guideStatus}
    {...props}
  />
)
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VaultUnlockerForm)
