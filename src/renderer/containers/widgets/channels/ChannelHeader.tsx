import { useDispatch, useSelector } from 'react-redux'

import React, { useCallback } from 'react'
import ChannelHeader, { ChannelHeaderProps } from '../../../components/widgets/channels/ChannelHeader'
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

export const useChannelInputData = (contactId?) => {
  const contact = useSelector(contactsSelectors.contact(contactId))
  const channelData = useSelector(channelSelectors.data)
  const data = {
    channel: {
      name: contactId === 'general' ? 'zbay' : contact.username,
      address: contactId
    },
    name: contact.username,
    members: useSelector(channelSelectors.channelParticipiants),
    mutedFlag:
      useSelector(notificationCenter.channelFilterById(
        channelData ? channelData.key : 'none'
      )) === notificationFilterType.MUTE
  }

  return data
}

export const useChannelInputActions = () => {
  const dispatch = useDispatch()

  const unmute = useCallback(() => {
    dispatch(notificationCenterHandlers.epics.setChannelsNotification(
      notificationFilterType.ALL_MESSAGES
    ))
  }, [dispatch])

  return { unmute }
}

export const ChannelHeaderContainer: React.FC<ChannelHeaderProps> = ({
  isRegisteredUsername,
  updateShowInfoMsg,
  directMessage,
  channelType,
  tab,
  setTab,
  channel,
  offer,
  mutedFlag,
  unmute,
  name,
  contactId
}
) => {
  channel = useChannelInputData(contactId).channel
  name = useChannelInputData(contactId).name
  mutedFlag = useChannelInputData(contactId).mutedFlag

  unmute = useChannelInputActions().unmute

  return (
    <ChannelHeader
      unmute={unmute}
      channel={channel}
      name={name}
      mutedFlag={mutedFlag}
      setTab={setTab}
      offer={offer}
      tab={tab}
      directMessage={directMessage}
      updateShowInfoMsg={updateShowInfoMsg}
      isRegisteredUsername={isRegisteredUsername}
      channelType={channelType}
    />
  )}

export default ChannelHeaderContainer
