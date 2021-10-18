import { communities } from '@zbayapp/nectar'
import React from "react"
import { CommunityAction } from "../../../components/widgets/performCommunityAction/community.keys"
import PerformCommunityActionComponent from "../../../components/widgets/performCommunityAction/PerformCommunityActionComponent"

const CreateCommunity = () => {
  return (
    <PerformCommunityActionComponent
      initialValue={'Enter a name for your community'}
      communityAction={CommunityAction.Create}
      handleCommunityAction={communities.actions.createNewCommunity}
      handleClose={null}
    />
  )
}

export default CreateCommunity