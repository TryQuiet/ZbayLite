import React, { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { communities, identity } from '@zbayapp/nectar'
import { CommunityAction } from '../../../components/widgets/performCommunityAction/community.keys'
import PerformCommunityActionComponent from '../../../components/widgets/performCommunityAction/PerformCommunityActionComponent'
import { ModalName } from '../../../sagas/modals/modals.types'
import { useModal } from '../../hooks'

const JoinCommunity: FC = () => {
  const dispatch = useDispatch()

  const community = useSelector(communities.selectors.currentCommunity)
  const credentials = useSelector(identity.selectors.currentIdentity)

  const joinCommunityModal = useModal(ModalName.joinCommunityModal)
  const createCommunityModal = useModal(ModalName.createCommunityModal)
  const createUsernameModal = useModal(ModalName.createUsernameModal)

  useEffect(() => {
    if (!community && !joinCommunityModal.open) {
      joinCommunityModal.handleOpen()
    }
  }, [community, joinCommunityModal, dispatch])

  useEffect(() => {
    console.log(credentials)
    if(credentials?.hiddenService) {
      createUsernameModal.handleOpen()
      joinCommunityModal.handleClose()
    }
  }, [credentials])

  const handleCommunityAction = (value: string) => {
    dispatch(communities.actions.joinCommunity(value))
  }

  const handleRedirection = () => {
    if(!createCommunityModal.open) {
      createCommunityModal.handleOpen()
    } else {
      joinCommunityModal.handleClose()
    }
  }

  return (
    <PerformCommunityActionComponent
      {...joinCommunityModal}
      initialValue={''}
      communityAction={CommunityAction.Join}
      handleCommunityAction={handleCommunityAction}
      handleRedirection={handleRedirection}
    />
  )
}

export default JoinCommunity
