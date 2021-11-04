import React, { useEffect } from 'react'
import LoadingPanelComponent from '../../../components/widgets/loadingPanel/loadingPanel'
import { useModal } from '../../hooks'
import { ModalName } from '../../../sagas/modals/modals.types'
import { CreateUsernameModalProps } from '../createUsernameModal/CreateUsername'
import { CommunityAction } from '../../../components/widgets/performCommunityAction/community.keys'
import { useSelector } from 'react-redux'
import { communities } from '@zbayapp/nectar'
import { LoadingMessages } from './loadingMessages'

const LoadingCreateCommunity = () => {
  const createUsernameModal = useModal<CreateUsernameModalProps>(ModalName.createUsernameModal)
  const loadingCreateCommunity = useModal(ModalName.loadingCreateCommunity)
  const isSpinnerOpen = loadingCreateCommunity.open

  const invitationUrl = useSelector(communities.selectors.registrarUrl)
  const action = createUsernameModal.communityAction === CommunityAction.Join

  useEffect(() => {
    if (isSpinnerOpen && action) {
      loadingCreateCommunity.handleClose()
    }
  }, [isSpinnerOpen, action])

  useEffect(() => {
    if (invitationUrl) {
      loadingCreateCommunity.handleClose()
    }
  }, [invitationUrl])

  return (
    <LoadingPanelComponent
      {...loadingCreateCommunity}
      message={LoadingMessages.CreateCommunity}
    />
  )
}

export default LoadingCreateCommunity
