import React, { useEffect } from 'react'
import LoadingPanelComponent from '../../../components/widgets/loadingPanel/loadingPanel'
import { useModal } from '../../hooks'
import { ModalName } from '../../../sagas/modals/modals.types'
import { CreateUsernameModalProps } from '../createUsernameModal/CreateUsername'
import { CommunityAction } from '../../../components/widgets/performCommunityAction/community.keys'
import { useSelector } from 'react-redux'
import { publicChannels } from '@zbayapp/nectar'
import { LoadingMessages } from './loadingMessages'

const LoadingJoinCommunity = () => {
  const createUsernameModal = useModal<CreateUsernameModalProps>(ModalName.createUsernameModal)
  const loadingJoinCommunity = useModal(ModalName.loadingJoinCommunity)
  const isSpinnerOpen = loadingJoinCommunity.open

  const channels = useSelector(publicChannels.selectors.publicChannels)
  const numberOfChannels = channels.length
  const action = createUsernameModal.communityAction === CommunityAction.Create
    ? true
    : false

  useEffect(() => {
    if (isSpinnerOpen && action) {
      loadingJoinCommunity.handleClose()
    }
  }, [isSpinnerOpen, action])

  useEffect(() => {
    if (numberOfChannels) {
      loadingJoinCommunity.handleClose()
    }
  }, [numberOfChannels])

  return (
    <LoadingPanelComponent
      {...loadingJoinCommunity}
      message={LoadingMessages.JoinCommunity}
    />
  )
}

export default LoadingJoinCommunity
