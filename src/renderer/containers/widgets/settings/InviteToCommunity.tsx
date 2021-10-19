import React from "react";
import { FC } from "react";
import { useSelector } from "react-redux";
import { communities } from "@zbayapp/nectar";
import { InviteToCommunity } from "../../../components/widgets/settings/InviteToCommunity";

const InviteToCommunityTab: FC = () => {
  // const communityName = useSelector(communities.selectors.currentCommunity).name
  // const invitationUrl = useSelector(communities.selectors.registrarUrl)
  const invitationUrl = 'http://thisislink.onion'
  const communityName = 'My Community'
  return (
    <InviteToCommunity
      communityName={communityName}
      invitationUrl={invitationUrl}
    />
  )
}

export default InviteToCommunityTab