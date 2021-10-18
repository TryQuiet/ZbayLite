import { communities } from '@zbayapp/nectar'
import React, { useCallback } from "react"
import { useHistory } from 'react-router-dom'
import { CommunityAction } from "../../../components/widgets/performCommunityAction/community.keys"
import PerformCommunityActionComponent from "../../../components/widgets/performCommunityAction/PerformCommunityActionComponent"

const JoinCommunity = () => {
  const history = useHistory();
  const handleOnClick = useCallback(() => history.push('/createCommunity'), [history])

  return (
    <PerformCommunityActionComponent
      initialValue={'Enter community url'}
      communityAction={CommunityAction.Join}
      handleCommunityAction={communities.actions.joinCommunity}
      handleClose={null}
      handleRedirection={handleOnClick}
    />
  )
}

export default JoinCommunity