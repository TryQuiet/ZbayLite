import React from 'react'

import ChannelsListItemComponent from '../../../components/widgets/channels/ChannelsListItem'

export const ChannelsListItem = ({ channel, selected, key, directMessages }) => {
  return (
    <ChannelsListItemComponent
      selected={selected}
      directMessages={directMessages}
      channel={channel}
      history={key}
    />
  )
}

export default ChannelsListItem
