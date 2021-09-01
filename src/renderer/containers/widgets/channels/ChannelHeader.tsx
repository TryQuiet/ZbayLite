import { useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
import React from 'react'

import ChannelHeaderComponent from '../../../components/widgets/channels/ChannelHeader'
// import channelsHandlers from '../../../store/handlers/channels'
import notificationCenterHandlers from '../../../store/handlers/notificationCenter'

import channelSelectors from '../../../store/selectors/channel'
import contactsSelectors from '../../../store/selectors/contacts'
// import identitySelectors from '../../../store/selectors/identity'
import notificationCenter from '../../../store/selectors/notificationCenter'

import { publicChannels } from '@zbayapp/nectar'

import { notificationFilterType } from '../../../../shared/static'

const useData = () => {
  const currentChannel = useSelector(publicChannels.selectors.currentChannel)
  const channels = useSelector(publicChannels.selectors.publicChannels)
  const data = {
    channel: channels.find(channel => channel.address === currentChannel),
    name: '',
    members: [],
    mutedFlag: false

  }
  return data
}

export const mapStateToProps = (state, props) => {
  const contact = contactsSelectors.contact(props.contactId)(state)
  return {
    channel: {
      name: props.contactId === 'general' ? 'zbay' : contact.username,
      address: props.contactId
    },
    name: contact.username,
    // userAddress: identitySelectors.address(state),
    members: channelSelectors.channelParticipiants(state),
    // showAdSwitch: !!contactsSelectors
    //   .messages(props.contactId)(state)
    //   .find(msg => msg.type === messageType.AD),
    mutedFlag:
      notificationCenter.channelFilterById(
        channelSelectors.data(state) ? channelSelectors.data(state).key : 'none'
      )(state) === notificationFilterType.MUTE
  }
}
export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      // updateShowInfoMsg: channelsHandlers.epics.updateShowInfoMsg,
      unmute: () =>
        notificationCenterHandlers.epics.setChannelsNotification(
          notificationFilterType.ALL_MESSAGES
        )
    },
    dispatch
  )

const ChannelHeader = () => {
  const { channel, name, members, mutedFlag } = useData()

  return (
    <ChannelHeaderComponent
      channel={channel}
      name={name}
      members={members}
      mutedFlag={mutedFlag}
    />)
}

export default ChannelHeader
