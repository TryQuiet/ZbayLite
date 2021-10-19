import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { errors, identity, socketActionTypes } from '@zbayapp/nectar'
import CreateUsernameModalComponent from '../../../components/widgets/createUsername/CreateUsernameModal'
import { ModalName } from '../../../sagas/modals/modals.types'
import { useModal } from '../../hooks'

const CreateUsernameModal = () => {
  const dispatch = useDispatch()

  const certificate = useSelector(identity.selectors.currentIdentity)?.userCertificate
  const error = useSelector(errors.selectors.currentCommunityErrorByType(socketActionTypes.REGISTRAR))

  const createUsernameModal = useModal(ModalName.createUsernameModal)

  useEffect(() => {
    if (certificate) {
      createUsernameModal.handleClose()
    }
  }, [certificate])

  const handleRegisterUsername = (payload: {nickname: string}) => {
    dispatch(identity.actions.registerUsername(payload.nickname))
  }

  return (
    <CreateUsernameModalComponent
      {...createUsernameModal}
      initialValue={''}
      handleRegisterUsername={handleRegisterUsername}
      certificateRegistrationError={error}
      certificate={certificate}
    />
  )
}

export default CreateUsernameModal
