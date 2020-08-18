import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Immutable from 'immutable'
import { bindActionCreators } from 'redux'

import ChannelMessagesComponent from '../../../components/widgets/channels/ChannelMessages'
import channelSelectors from '../../../store/selectors/channel'
import channelsSelectors from '../../../store/selectors/channels'
import dmQueueMessages from '../../../store/selectors/directMessagesQueue'
import queueMessages from '../../../store/selectors/messagesQueue'
import userSelector from '../../../store/selectors/users'
import contactsSelectors from '../../../store/selectors/contacts'
import nodeSelector from '../../../store/selectors/node'
import appSelectors from '../../../store/selectors/app'
import ownedChannelsSelectors from '../../../store/selectors/ownedChannels'
import publicChannelsSelector from '../../../store/selectors/publicChannels'
import { messageType } from '../../../../shared/static'
import zcashChannels from '../../../zcash/channels'
import channelHandlers from '../../../store/handlers/channel'

export const mapStateToProps = (state, { signerPubKey, network }) => {
  const qMessages = queueMessages.queue(state)
  const qDmMessages = dmQueueMessages.queue(state)
  const contactId = channelSelectors.id(state)
  return {
    triggerScroll: qDmMessages.size + qMessages.size > 0,
    qMessages: qMessages,
    channelData:
      channelsSelectors.channelById(channelSelectors.channelId(state))(state) ||
      Immutable.fromJS({ keys: {} }),
    messages: contactsSelectors.directMessages(contactId, signerPubKey)(state),
    messagesLength: contactsSelectors.messagesLength(contactId)(state),
    displayableMessageLimit: channelSelectors.displayableMessageLimit(state),
    channelId: channelSelectors.channelId(state),
    isOwner: ownedChannelsSelectors.isOwner(state),
    users: userSelector.users(state),
    loader: channelSelectors.loader(state),
    publicChannels: publicChannelsSelector.publicChannels(state),
    network: nodeSelector.network(state),
    isInitialLoadFinished: appSelectors.isInitialLoadFinished(state)
  }
}
export const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      onLinkedChannel: channelHandlers.epics.linkChannelRedirect,
      setDisplayableLimit: channelHandlers.actions.setDisplayableLimit
    },
    dispatch
  )
export const ChannelMessages = ({
  messages,
  tab,
  network,
  contactId,
  channelId,
  contentRect,
  triggerScroll,
  channelData,
  users,
  publicChannels,
  onLinkedChannel,
  isInitialLoadFinished,
  loader,
  messagesLength,
  displayableMessageLimit,
  setDisplayableLimit,
  isOwner
}) => {
  const [scrollPosition, setScrollPosition] = React.useState(-1)
  // console.log(messagesLength)
  // console.log(displayableMessageLimit)
  // console.log(scrollPosition)
  useEffect(() => {
    setScrollPosition(-1)
  }, [channelId, contactId])
  useEffect(() => {
    if (triggerScroll) {
      setScrollPosition(-1)
    }
  }, [triggerScroll])
  useEffect(() => {
    if (scrollPosition === 0 && displayableMessageLimit < messagesLength) {
      setDisplayableLimit(displayableMessageLimit + 5)
    }
  }, [scrollPosition])
  const oldestMessage = messages ? messages.last() : null
  let usersRegistration = []
  let publicChannelsRegistration = []
  if (channelId === zcashChannels.general[network].address) {
    usersRegistration = Array.from(users.values()).filter(msg => msg.createdAt >= oldestMessage.createdAt)
    publicChannelsRegistration = Array.from(
      Object.values(publicChannels.toJS())
    ).filter(msg => msg.timestamp >= oldestMessage.createdAt)
    for (const ch of publicChannelsRegistration) {
      delete Object.assign(ch, { createdAt: parseInt(ch['timestamp']) })['timestamp']
    }
  }
  return (
    <ChannelMessagesComponent
      scrollPosition={scrollPosition}
      setScrollPosition={setScrollPosition}
      messages={
        tab === 0
          ? messages
          : messages.filter(msg => msg.type === messageType.AD)
      }
      contactId={contactId}
      contentRect={contentRect}
      isOwner={isOwner}
      publicChannelsRegistration={publicChannelsRegistration}
      usersRegistration={usersRegistration}
      users={users}
      onLinkedChannel={onLinkedChannel}
      publicChannels={publicChannels}
      isInitialLoadFinished={loader.loading ? false : isInitialLoadFinished}
    />
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  React.memo(ChannelMessages, (before, after) => {
    return (
      Immutable.is(before.messages, after.messages) &&
      before.tab === after.tab &&
      before.isInitialLoadFinished === after.isInitialLoadFinished &&
      Immutable.is(before.users, after.users) &&
      Immutable.is(before.publicChannels, after.publicChannels)
    )
  })
)
