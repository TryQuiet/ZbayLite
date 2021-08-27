import React from 'react'
import { bindActionCreators } from 'redux'
import { connect, useDispatch, useSelector } from 'react-redux'
import * as R from 'ramda'

import { identity } from '@zbayapp/nectar'

import IdentityPanelComponent from '../../components/ui/IdentityPanel'
// import identitySelectors from '../../store/selectors/identity'
// import usersSelectors from '../../store/selectors/users'
import actionCreators from '../../store/handlers/modals'

export const useData = () => {
  const data = {
    nickname: useSelector(identity.selectors.zbayNickname)
  }
  return data
}

// export const mapDispatchToProps = dispatch =>
//   bindActionCreators(
//     {
//       handleSettings: actionCreators.openModal('accountSettingsModal'),
//       handleInvitation: actionCreators.openModal('invitationModal')
//     },
//     dispatch
//   )

const IdentityPanel = () => {
  const { nickname } = useData()
  const dispatch = useDispatch()

  const handleSettings = () => dispatch(actionCreators.openModalHandler('accountSettingsModal'))

  return <IdentityPanelComponent nickname={nickname} handleSettings={handleSettings} />
}

export default IdentityPanel
