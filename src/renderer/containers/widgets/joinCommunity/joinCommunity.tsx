import { communities } from '@zbayapp/nectar'
import React from "react"
import { CommunityAction } from "../../../components/widgets/performCommunityAction/community.keys"
import PerformCommunityActionComponent from "../../../components/widgets/performCommunityAction/PerformCommunityActionComponent"

const JoinCommunity = () => {
  return (
    <PerformCommunityActionComponent
      initialValue={'Enter community url'}
      communityAction={CommunityAction.Join}
      handleCommunityAction={communities.actions.joinCommunity}
      handleClose={null}
    />
  )
}

export default JoinCommunity