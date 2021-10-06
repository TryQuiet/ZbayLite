// @ts-nocheck
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ChannelInputComponent from '../../../components/widgets/channels/ChannelInput'
import channelHandlers from '../../../store/handlers/channel'
import mentionsHandlers from '../../../store/handlers/mentions'
import channelSelectors from '../../../store/selectors/channel'
import { publicChannels, messages, identity, users } from '@zbayapp/nectar'

export const useChannelInputData = () => {
  const currentChannel = useSelector(publicChannels.selectors.currentChannel)
  const channels = useSelector(publicChannels.selectors.publicChannels)

  const data = {
    message: useSelector(channelSelectors.message),
    id: useSelector(channelSelectors.id),
    inputState: useSelector(channelSelectors.inputLocked),
    members: useSelector(channelSelectors.members),
    channelName: channels.find(channel => channel.address === currentChannel)?.name,
    users: useSelector(users.selectors.certificatesMapping),
    myUser: useSelector(identity.selectors.currentIdentity),
    isMessageTooLong: useSelector(channelSelectors.messageSizeStatus)
  }
  return data
}

export const useChannelInputActions = () => {
  const dispatch = useDispatch()

  const onChange = useCallback(
    (arg: { value: string; id: string }) => {
      dispatch(channelHandlers.actions.setMessage(arg))
    },
    [dispatch]
  )

  const sendOnEnter = useCallback(
    message => {
      dispatch(messages.actions.sendMessage(message))
    },
    [dispatch]
  )

  const checkMentions = useCallback(() => {
    dispatch(mentionsHandlers.epics.checkMentions())
  }, [dispatch])

  return { onChange, sendOnEnter, checkMentions }
}

export const ChannelInput = () => {
  const [infoClass, setInfoClass] = React.useState<string>(null)

  const {
    channelName,
    id,
    inputState,
    isMessageTooLong,
    members,
    message,
    myUser,
    users
  } = useChannelInputData()

  const { checkMentions, onChange, sendOnEnter } = useChannelInputActions()

  return (
    <ChannelInputComponent
      infoClass={infoClass}
      setInfoClass={setInfoClass}
      id={id}
      users={users}
      onChange={e => {
        onChange({ value: e, id })
      }}
      onKeyPress={message => {
        checkMentions()
        sendOnEnter(message)
      }}
      message={message}
      inputState={inputState}
      inputPlaceholder={`#${channelName} as @${myUser ? myUser.zbayNickname : ''}`}
      channelName={channelName}
      members={members}
      isMessageTooLong={isMessageTooLong}
    />
  )
}

export default ChannelInput
