import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import modalsSelectors from '../../../store/selectors/modals'
import modalsHandlers from '../../../store/handlers/modals'

import CreateUsernameModalComponent from '../../../components/widgets/createUsername/CreateUsernameModal'
import { identity, errors } from '@zbayapp/nectar'

const useData = () => {
  const modalName = 'createUsernameModal'
  const data = {
    initialValue: '',
    modalName,
    open: useSelector(modalsSelectors.open(modalName)),
    certificateRegistrationError: useSelector(errors.selectors.certificateRegistration),
    certificate: useSelector(identity.selectors.userCertificate)
  }
  return data
}

const CreateUsernameModal = () => {
  const {
    initialValue,
    modalName,
    certificateRegistrationError,
    certificate,
    open
  } = useData()
  const dispatch = useDispatch()

  const handleSubmit = (nickname: string) => {
    dispatch(identity.actions.registerUsername(nickname))
  }
  const handleOpen = () => {
    dispatch(modalsHandlers.actionCreators.openModal(modalName))
  }
  const handleClose = () => {
    dispatch(modalsHandlers.closeModalHandler(modalName))
  }

  return (
    <CreateUsernameModalComponent
      handleSubmit={handleSubmit}
      initialValue={initialValue}
      open={open}
      handleOpen={handleOpen}
      handleClose={handleClose}
      certificateRegistrationError={certificateRegistrationError}
      certificate={certificate}
    />
  )
}

export default CreateUsernameModal
