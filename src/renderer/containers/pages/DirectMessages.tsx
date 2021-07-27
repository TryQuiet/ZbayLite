import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as R from 'ramda'

import channelHandlers from '../../store/handlers/channel'
import ChannelComponent from '../../components/pages/Channel'
import { CHANNEL_TYPE } from '../../components/pages/ChannelTypes'

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadChannel: channelHandlers.epics.loadChannel
    },
    dispatch
  )

const DirectMessages = ({
  match,
  loadChannel
}) => {
  
  useEffect(
    () => {
      console.log(`match parrams id ${match.params}`, {match})
      loadChannel(match.params.username)
    },
    [match.params.username]
  )
  return <ChannelComponent channelType={CHANNEL_TYPE.DIRECT_MESSAGE} contactId={match.params.username} />
}

export default R.compose(
  React.memo,
  connect(
    null,
    mapDispatchToProps
  )
)(DirectMessages)
