import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import modalsSelectors from '../../../store/selectors/modals'

import CreateUsernameModalComponent from '../../../components/widgets/createUsername/CreateUsernameModal'
import { identity, communities } from '@zbayapp/nectar'
import { useModal } from '../../hooks'
import { ModalName } from '../../../sagas/modals/modals.types'

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

  const modal = useModal(ModalName.createUsernameModal)

  return (
    <CreateUsernameModalComponent
      // handleSubmit={handleSubmit}
      handleRegisterUsername={handleRegisterUsername}
      triggerSelector={triggerSelector}
      initialValue={initialValue}
      open={open}
      handleOpen={modal.handleOpen}
      handleClose={modal.handleClose}
      certificateRegistrationError={certificateRegistrationError}
      certificate={certificate}
      id={id}
    />
  )
}

export default CreateUsernameModal
