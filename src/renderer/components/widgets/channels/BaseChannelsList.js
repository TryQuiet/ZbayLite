import React from 'react'
import Immutable from 'immutable'
import PropTypes from 'prop-types'

import List from '@material-ui/core/List'

import ChannelsListItem from '../../../containers/widgets/channels/ChannelsListItem'
import OfferListItem from '../../../containers/widgets/channels/OfferListItem'
import { unknownUserId } from '../../../../shared/static'

export const propTypes = {
  channel: PropTypes.shape({
    name: PropTypes.string.isRequired,
    private: PropTypes.bool.isRequired,
    hash: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    unread: PropTypes.number,
    description: PropTypes.string
  })
}

export const BaseChannelsList = ({
  channels,
  unknownMessages,
  directMessages,
  selected,
  offers,
  selectedOffer
}) => {
  const [...keys] = offers.keys()
  console.log('channels', channels.toJS())
  console.log('dupa', unknownMessages.get(0) ? console.log(unknownMessages.get(0).toJS()) : null)
  return (
    <List disablePadding>
      {channels
        .filter(ch => ch.username !== unknownUserId)
        .map(channel => (
          <ChannelsListItem
            key={channel.key}
            channel={channel}
            directMessages={directMessages}
            selected={selected}
          />
        ))}
      {offers.toList().map((offer, index) => (
        <OfferListItem
          key={keys[index]}
          channel={offer}
          selected={selectedOffer}
        />
      ))}
      {unknownMessages.size > 0 && (
        <ChannelsListItem
          key={unknownUserId}
          channel={unknownMessages.get(0)}
          directMessages={directMessages}
          selected={selected}
        />
      )}
    </List>
  )
}

BaseChannelsList.propTypes = {
  channels: PropTypes.instanceOf(Immutable.List).isRequired,
  unknownMessages: PropTypes.instanceOf(Immutable.List).isRequired,
  selected: PropTypes.instanceOf(Immutable.Record).isRequired,
  selectedOffer: PropTypes.instanceOf(Immutable.Record).isRequired,
  directMessages: PropTypes.bool
}

BaseChannelsList.defaultProps = {
  channels: Immutable.List(),
  unknownMessages: Immutable.List(),
  offers: Immutable.Map(),
  displayAddress: false,
  directMessages: false
}

export default React.memo(BaseChannelsList)
