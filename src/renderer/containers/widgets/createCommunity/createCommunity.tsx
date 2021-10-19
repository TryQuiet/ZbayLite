import React from 'react'
import { useDispatch } from 'react-redux'
import { communities } from '@zbayapp/nectar'
import { CommunityAction } from '../../../components/widgets/performCommunityAction/community.keys'
import PerformCommunityActionComponent from '../../../components/widgets/performCommunityAction/PerformCommunityActionComponent'
import { ModalName } from '../../../sagas/modals/modals.types'
import { useModal } from '../../hooks'

const CreateCommunity = () => {
  const dispatch = useDispatch()

  const createCommunityModal = useModal(ModalName.createCommunityModal)
  const joinCommunityModal = useModal(ModalName.joinCommunityModal)

  const handleCommunityAction = (value: string) => {
    dispatch(communities.actions.createNewCommunity(value))
  }

  const handleRedirection = () => {
    if(!joinCommunityModal.open) {
      joinCommunityModal.handleOpen()
    } else {
      createCommunityModal.handleClose()
    }
  }

  return (
    <PerformCommunityActionComponent
      {...createCommunityModal}
      initialValue={''}
      communityAction={CommunityAction.Create}
      handleCommunityAction={handleCommunityAction}
      handleRedirection={handleRedirection}
    />
  )
}

export default CreateCommunity
