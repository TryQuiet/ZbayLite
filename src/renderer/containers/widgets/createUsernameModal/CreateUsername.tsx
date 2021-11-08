import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { communities, errors, identity, publicChannels, socketActionTypes } from '@zbayapp/nectar'
import CreateUsernameModalComponent from '../../../components/widgets/createUsername/CreateUsernameModal'
import { ModalName } from '../../../sagas/modals/modals.types'
import { useModal } from '../../hooks'
import { CommunityAction } from '../../../components/widgets/performCommunityAction/community.keys'
import { LoadingMessages } from '../loadingPanel/loadingMessages'

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

  const invitationUrl = useSelector(communities.selectors.registrarUrl)
  const channels = useSelector(publicChannels.selectors.publicChannels)
  const numberOfChannels = channels.length
  const createUsernameModal = useModal<CreateUsernameModalProps>(ModalName.createUsernameModal)
  const joinCommunityModal = useModal(ModalName.joinCommunityModal)
  const createCommunityModal = useModal(ModalName.createCommunityModal)
  const loadingCommunity = useModal(ModalName.loadingPanel)

  useEffect(() => {
    if (certificate &&
      ((createUsernameModal.communityAction === CommunityAction.Join && numberOfChannels) ||
        (createUsernameModal.communityAction === CommunityAction.Create && invitationUrl))) {
      loadingCommunity.handleClose()
      createUsernameModal.handleClose()
      joinCommunityModal.handleClose()
      createCommunityModal.handleClose()
    }
  }, [numberOfChannels, invitationUrl, certificate])

  useEffect(() => {
    if (id?.hiddenService) {
      dispatch(identity.actions.registerUsername(username))
    }
  }, [id?.hiddenService])

  const handleAction = (payload: { nickname: string }) => {
    setUsername(payload.nickname)
    const value = createUsernameModal.communityData
    const action =
      createUsernameModal.communityAction === CommunityAction.Create
        ? communities.actions.createNewCommunity(value)
        : communities.actions.joinCommunity(value)
    /* Launch/create community */

    const message = createUsernameModal.communityAction === CommunityAction.Create
      ? LoadingMessages.CreateCommunity
      : LoadingMessages.JoinCommunity

    loadingCommunity.handleOpen({
      message
    })
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
