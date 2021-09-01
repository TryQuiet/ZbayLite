
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { bindActionCreators } from 'redux'

// import identityHandlers from '../../store/handlers/identity'
// import identitySelectors from '../../store/selectors/identity'
// import userSelectors from '../../store/selectors/users'
import TopUpModalComponent from '../../components/ui/TopUpModal/TopUpModal'
import modalsHandlers, { withModal } from '../../store/handlers/modals'

export const mapStateToProps = _state => ({
  // users: [userSelectors.users(state)],
  // privateAddress: identitySelectors.address(state),
  users: [],
  privateAddress: 'mock'
  // transparentAddress: identitySelectors.transparentAddress(state),
  // donationAddress: identitySelectors.donationAddress(state),
  // donationAllow: identitySelectors.donationAllow(state)
})
export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      // updateDonation: identityHandlers.epics.updateDonation,
      // setDonationAddress: identityHandlers.actions.setDonationAddress,
      // setDonationAllow: identityHandlers.actions.setDonationAllow,

      // setShieldingTax: identityHandlers.actions.setShieldingTax,
      // updateShieldingTax: identityHandlers.epics.updateShieldingTax,
      // updateDonationAddress: address =>
      //   identityHandlers.epics.updateDonationAddress(address),
      openSettingsModal: modalsHandlers.actionCreators.openModal(
        'accountSettingsModal'
      )
      // setTabToOpen: () => actions.setModalTab('buyZcash')
    },
    dispatch
  )

export const TopUpModal = props => {
  const [type, setType] = useState('transparent')
  const address =
    type === 'transparent' ? props.transparentAddress : props.privateAddress
  // const isAddressValid = /^t1[a-zA-Z0-9]{33}$|^ztestsapling1[a-z0-9]{75}$|^zs1[a-z0-9]{75}$|[A-Za-z0-9]{35}/.test(
  //   props.donationAddress
  // )
  // useEffect(() => {
  //   if (isAddressValid) {
  //     props.updateDonationAddress(props.donationAddress)
  //   }
  //   if (
  //     props.donationAddress &&
  //     props.donationAllow === 'false' &&
  //     isAddressValid
  //   ) {
  //     props.updateDonation('true')
  //   }
  //   if (!props.donationAddress && props.donationAllow === 'true') {
  //     props.updateDonation('false')
  //   }
  // }, [props.donationAddress])
  return (
    <TopUpModalComponent
      type={type}
      address={address}
      handleChange={e => setType(e.target.value)}
      {...props}
    />
  )
}

TopUpModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleCopy: PropTypes.func
}

export default R.compose(
  connect(mapStateToProps, mapDispatchToProps),
  withModal('topUp')
)(TopUpModal)
