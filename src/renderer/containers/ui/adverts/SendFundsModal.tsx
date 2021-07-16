import React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'

import { withModal, actionCreators } from '../../../store/handlers/modals'
// import { rate } from '../../../store/selectors/rates'
import identitySelector from '../../../store/selectors/identity'
// import appHandlers from '../../../store/handlers/app'
import modalSelectors from '../../../store/selectors/modals'
import SendFundsForm from '../../../components/ui/adverts/SendFundsForm'

export const mapStateToProps = state => ({
  // rateUsd: rate('usd')(state),
  // rateZec: 1 / rate('usd')(state),
  // balanceZec: identitySelector.balance('zec')(state),
  // lockedBalance: identitySelector.lockedBalance('zec')(state),
  payload: modalSelectors.payload('advertSendFounds')(state),
  shippingData: identitySelector.shippingData(state)
})

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      // TODO: Zcash
      // handleSendTransfer: advertHandlers.epics.handleSendTransfer,
      // openAddFundsTab: () => appHandlers.actions.setModalTab('addFunds'),
      // openShippingTab: () => appHandlers.actions.setModalTab('shipping'),
      openSettingsModal: actionCreators.openModal('accountSettingsModal')
    },
    dispatch
  )

export default R.compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withModal('advertSendFounds'),
  withRouter,
  React.memo
)(SendFundsForm)
