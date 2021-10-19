import { communities } from '@zbayapp/nectar';
import React from "react";
import { useDispatch } from 'react-redux';
import { CommunityAction } from "../../../components/widgets/performCommunityAction/community.keys";
import PerformCommunityActionComponent from "../../../components/widgets/performCommunityAction/PerformCommunityActionComponent";
import { ModalName } from '../../../sagas/modals/modals.types';
import { actionCreators, useModal } from '../../../store/handlers/modals';

const CreateCommunity = () => {
  const dispatch = useDispatch()
  const handleOnClick = () => actionCreators.openModal(ModalName.joinCommunityModal)
  const modal = useModal(ModalName.createCommunityModal)
  const handleCommunityAction = (value: string) => {dispatch(communities.actions.createNewCommunity(value))}
  return (
    <PerformCommunityActionComponent
      {...modal}
      initialValue={''}
      communityAction={CommunityAction.Create}
      handleCommunityAction={handleCommunityAction}
      handleRedirection={handleOnClick}
    />
  )
}

export default CreateCommunity