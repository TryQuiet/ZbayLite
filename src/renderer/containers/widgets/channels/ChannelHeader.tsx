import { useDispatch, useSelector } from 'react-redux'

import React, { useCallback } from 'react'
import ChannelHeader, { ChannelHeaderProps } from '../../../components/widgets/channels/ChannelHeader'
import notificationCenterHandlers from '../../../store/handlers/notificationCenter'

import channelSelectors from '../../../store/selectors/channel'
import contactsSelectors from '../../../store/selectors/contacts'
import notificationCenter from '../../../store/selectors/notificationCenter'
import { notificationFilterType } from '../../../../shared/static'
import { publicChannels, messages, identity, users } from '@zbayapp/nectar'


export const useChannelHeaderData = (contactId: string) => {
  const contact = useSelector(contactsSelectors.contact(contactId))
  const channelData = useSelector(channelSelectors.data)
  const data = {
    channel: {
      name: useSelector(publicChannels.selectors.currentChannel),
      address: contactId,
      displayableMessageLimit: 50
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
  updateShowInfoMsg,
  directMessage,
  channelType,
  tab,
  setTab,
  channel,
  mutedFlag,
  unmute,
  name,
  contactId
}
) => {
  channel = useChannelHeaderData(contactId).channel
  name = useChannelHeaderData(contactId).name
  mutedFlag = useChannelHeaderData(contactId).mutedFlag

  unmute = useChannelInputActions().unmute

  return (
    <ChannelHeader
      unmute={unmute}
      channel={channel}
      name={name}
      mutedFlag={mutedFlag}
      setTab={setTab}
      tab={tab}
      directMessage={directMessage}
      updateShowInfoMsg={updateShowInfoMsg}
      channelType={channelType}
    />
  )
}

export default ChannelHeaderContainer
