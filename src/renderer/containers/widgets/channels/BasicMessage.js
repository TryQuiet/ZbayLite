import React from 'react'
import { connect } from 'react-redux'

import BasicMessage from '../../../components/widgets/channels/BasicMessage'
import channelSelectors from '../../../store/selectors/channel'

export const mapStateToProps = state => {
  const isOwner = channelSelectors.isOwner(state)
  // TODO fix selector once moderation messages work
  const channelModerators = channelSelectors.channelModerators(state)
  return {
    allowModeration: isOwner || channelModerators
  }
}

export default connect(mapStateToProps)(React.memo(BasicMessage))
