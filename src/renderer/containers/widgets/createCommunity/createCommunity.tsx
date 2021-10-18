import { communities } from '@zbayapp/nectar';
import React, { useCallback } from "react";
import { useHistory } from 'react-router-dom';
import { CommunityAction } from "../../../components/widgets/performCommunityAction/community.keys";
import PerformCommunityActionComponent from "../../../components/widgets/performCommunityAction/PerformCommunityActionComponent";

const CreateCommunity = () => {
  const history = useHistory();
  const handleOnClick = useCallback(() => history.push('/joinCommunity'), [history])
  
  return (
    <PerformCommunityActionComponent
      initialValue={'Enter a name for your community'}
      communityAction={CommunityAction.Create}
      handleCommunityAction={communities.actions.createNewCommunity}
      handleClose={null}
      handleRedirection={handleOnClick}
    />
  )
}

export default CreateCommunity