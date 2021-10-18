import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import modalsSelectors from '../../../store/selectors/modals'
import modalsHandlers, { ModalName } from '../../../store/handlers/modals'

import CreateUsernameModalComponent from '../../../components/widgets/createUsername/CreateUsernameModal'
import { identity } from '@zbayapp/nectar'

const useData = () => {
  const modalName = ModalName.createUsernameModal
  const data = {
    initialValue: '',
    modalName,
    open: useSelector(modalsSelectors.open(modalName)),
    // certificateRegistrationError: useSelector(errors.selectors.currentCommunityErrorByType(socketActionTypes.REGISTRAR)),
    certificateRegistrationError: undefined,
    certificate: useSelector(identity.selectors.currentIdentity)?.userCertificate,
    id: useSelector(identity.selectors.currentIdentity)
  }
  return data
}

const CreateUsernameModal = () => {
  const {
    initialValue,
    modalName,
    certificateRegistrationError,
    certificate,
    open, id
  } = useData()
  const dispatch = useDispatch()

  const handleRegisterUsername = (username) => {
    console.log('handle register username')
    console.log(username)
    dispatch(identity.actions.registerUsername(username))
  }

  const triggerSelector = () => {

  }

  const handleOpen = () => {
    dispatch(modalsHandlers.actionCreators.openModal(modalName))
  }
  const handleClose = () => {
    dispatch(modalsHandlers.closeModalHandler(modalName))
  }

  return (
    <CreateUsernameModalComponent
      // handleSubmit={handleSubmit}
      handleRegisterUsername={handleRegisterUsername}
      triggerSelector={triggerSelector}
      initialValue={initialValue}
      open={open}
      handleOpen={handleOpen}
      handleClose={handleClose}
      certificateRegistrationError={certificateRegistrationError}
      certificate={certificate}
      id={id}
    />
  )
}

export default CreateUsernameModal
