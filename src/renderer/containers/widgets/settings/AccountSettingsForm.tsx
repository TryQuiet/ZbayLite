import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { identity } from '@zbayapp/nectar'

import modalsHandlers from '../../../store/handlers/modals'
import AccountSettingsFormComponent from '../../../components/widgets/settings/AccountSettingsForm'

const useData = () => {
  const data = {
    user: {
      nickname: useSelector(identity.selectors.zbayNickname)
    }
  }
  return data
}

export const AccountSettingsForm = () => {
  const { user } = useData()

  const dispatch = useDispatch()

  const openModal = dispatch(modalsHandlers.actionCreators.openModal('createUsernameModal'))
  const closeModal = dispatch(modalsHandlers.actionCreators.closeModal(''))

  return (
    <AccountSettingsFormComponent
      user={user}
      openModal={openModal}
      closeModal={closeModal}
    />
  )
}

export default AccountSettingsForm
