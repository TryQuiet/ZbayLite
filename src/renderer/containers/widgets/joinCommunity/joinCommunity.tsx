import { communities } from '@zbayapp/nectar'
import React, { FC, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { CommunityAction } from "../../../components/widgets/performCommunityAction/community.keys"
import PerformCommunityActionComponent from "../../../components/widgets/performCommunityAction/PerformCommunityActionComponent"
import { ModalName } from '../../../sagas/modals/modals.types'
import { useModal } from '../../hooks'


const JoinCommunity: FC = () => {
  const dispatch = useDispatch()
  const community = useSelector(communities.selectors.currentCommunityId)
  console.log('JoinModal community', community)
  const modal = useModal(ModalName.joinCommunityModal)
  useEffect(() => {
    console.log('JoinModalState in useEffect')
    if (!community && !modal.open)  {      
      modal.handleOpen()
    }
  }, [community, modal, dispatch])
  
  console.log('JoinModalState:', modal)
  const handleCommunityAction = (value: string) => {dispatch(communities.actions.joinCommunity(value))}
  return (
    <PerformCommunityActionComponent
      open={modal.open}
      handleClose={modal.handleClose}
      initialValue={''}
      communityAction={CommunityAction.Join}
      handleCommunityAction={handleCommunityAction}
      handleRedirection={() => {}}
    />
  )
}

export default JoinCommunity