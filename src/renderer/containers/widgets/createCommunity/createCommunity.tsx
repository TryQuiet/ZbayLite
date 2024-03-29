import React from 'react'
import { useSelector } from 'react-redux'
import { CommunityAction } from '../../../components/widgets/performCommunityAction/community.keys'
import PerformCommunityActionComponent from '../../../components/widgets/performCommunityAction/PerformCommunityActionComponent'
import { ModalName } from '../../../sagas/modals/modals.types'
import { useModal } from '../../hooks'
import { socketSelectors } from '../../../sagas/socket/socket.selectors'
import { CreateUsernameModalProps } from '../createUsernameModal/CreateUsername'
import { communities } from '@zbayapp/nectar'

const CreateCommunity = () => {
  const isConnected = useSelector(socketSelectors.isConnected)

  const community = useSelector(communities.selectors.currentCommunity)
  const createCommunityModal = useModal(ModalName.createCommunityModal)
  const joinCommunityModal = useModal(ModalName.joinCommunityModal)
  const createUsernameModal = useModal<CreateUsernameModalProps>(ModalName.createUsernameModal)

  const handleCommunityAction = (name: string) => {
    createUsernameModal.handleOpen({
      communityAction: CommunityAction.Create,
      communityData: name
    })
  }

  const handleRedirection = () => {
    if (!joinCommunityModal.open) {
      joinCommunityModal.handleOpen()
    } else {
      createCommunityModal.handleClose()
    }
  }

  return (
    <PerformCommunityActionComponent
      {...createCommunityModal}
      communityAction={CommunityAction.Create}
      handleCommunityAction={handleCommunityAction}
      handleRedirection={handleRedirection}
      isConnectionReady={isConnected}
      community={Boolean(community)}
    />
  )
}

export default CreateCommunity
