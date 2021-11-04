import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { communities, errors, identity, socketActionTypes } from '@zbayapp/nectar'
import CreateUsernameModalComponent from '../../../components/widgets/createUsername/CreateUsernameModal'
import { ModalName } from '../../../sagas/modals/modals.types'
import { useModal } from '../../hooks'
import { CommunityAction } from '../../../components/widgets/performCommunityAction/community.keys'

export interface CreateUsernameModalProps {
  communityAction: CommunityAction
  communityData: string
}

const CreateUsernameModal = () => {
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')

  const id = useSelector(identity.selectors.currentIdentity)
  const certificate = useSelector(identity.selectors.currentIdentity)?.userCertificate

  const communityErrors = useSelector(errors.selectors.currentCommunityErrorsByType)
  const error = communityErrors?.[socketActionTypes.REGISTRAR]

  const createUsernameModal = useModal<CreateUsernameModalProps>(ModalName.createUsernameModal)
  const joinCommunityModal = useModal(ModalName.joinCommunityModal)
  const createCommunityModal = useModal(ModalName.createCommunityModal)

  const loadingCreateCommunity = useModal(ModalName.loadingCreateCommunity)
  const loadingJoinCommunity = useModal(ModalName.loadingJoinCommunity)

  useEffect(() => {
    if (id?.hiddenService) {
      dispatch(identity.actions.registerUsername(username))
    }
  }, [id?.hiddenService])

  useEffect(() => {
    if (certificate) {
      createUsernameModal.handleClose()
      joinCommunityModal.handleClose()
      createCommunityModal.handleClose()
    }
  }, [certificate])

  const handleAction = (payload: { nickname: string }) => {
    setUsername(payload.nickname)
    const value = createUsernameModal.communityData
    let action
    if (createUsernameModal.communityAction === CommunityAction.Create) {
      action = communities.actions.createNewCommunity(value)
      loadingCreateCommunity.handleOpen()
    } else {
      action = communities.actions.joinCommunity(value)
      loadingJoinCommunity.handleOpen()
    }

    dispatch(action)
  }

  return (
    <CreateUsernameModalComponent
      {...createUsernameModal}
      initialValue={''}
      handleRegisterUsername={handleAction}
      certificateRegistrationError={error?.message}
      certificate={certificate}
    />
  )
}

export default CreateUsernameModal
