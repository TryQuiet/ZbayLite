import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as R from 'ramda'

import MainComponent from '../../components/windows/Main'
import vaultSelectors from '../../store/selectors/vault'
import coordinator from '../../store/handlers/coordinator'
import nodeHandlers from '../../store/handlers/node'
import modalsHandlers from '../../store/handlers/modals'
import logsSelectors from '../../store/selectors/logs'
import identitySelectors from '../../store/selectors/identity'
import { fetchBalance } from '../../store/handlers/identity'
import electronStore from '../../../shared/electronStore'

export const mapStateToProps = state => ({
  vaultLocked: vaultSelectors.locked(state),
  isLogWindowOpened: logsSelectors.isLogWindowOpened(state),
  zecBalance: identitySelectors.balance('zec')(state)
})
export const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetch: coordinator.epics.coordinator,
      fetchBalance: fetchBalance,
      disablePowerSleepMode: nodeHandlers.epics.disablePowerSaveMode,
      openSettingsModal: modalsHandlers.actionCreators.openModal('createUsernameModal')
    },
    dispatch
  )
}

export const Main = ({ zecBalance, openSettingsModal, fetchBalance, ...props }) => {
  useEffect(() => {
    fetchBalance()
    const isNewUser = electronStore.get('isNewUser')
    if (isNewUser === true && zecBalance.gt(0)) {
      openSettingsModal()
    }
    electronStore.set('isNewUser', false)
  }, [])
  return <MainComponent {...props} />
}

export default R.compose(
  React.memo,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Main)
