import React from 'react'
import { connect } from 'react-redux'

import BasicMessage from '../../../components/widgets/channels/BasicMessage'
// import channelSelectors from '../../../store/selectors/channel'
// import contactsSelectors from '../../../store/selectors/contacts'
// import identitySelectors from '../../../store/selectors/identity'

export const mapStateToProps = _state => {
  // const isOwner = channelSelectors.isOwner(state)
  // const channelModerators = contactsSelectors.directMessages(channelSelectors.id(state))(state).channelModerators
  // const signerPubKey = identitySelectors.signerPubKey(state)
  // const isModerator = channelModerators.includes(signerPubKey)
  return {
    allowModeration: false
  }
}

export default connect(mapStateToProps)(React.memo(BasicMessage))
