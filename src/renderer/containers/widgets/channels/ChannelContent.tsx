import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ChannelContent from '../../../components/widgets/channels/ChannelContent'
import channelSelectors from '../../../store/selectors/channel'
import mentionsSelectors from '../../../store/selectors/mentions'
import mentionsHandlers from '../../../store/handlers/mentions'

export const useChannelContentData = () => {
  const data = {
    inputState: useSelector(channelSelectors.inputLocked),
    mentions: useSelector(mentionsSelectors.mentions),
    channelId: useSelector(channelSelectors.channelId)
  }
  return data
}

export const useChannelContentActions = () => {
  const dispatch = useDispatch()

  const removeMention = (nickname: string) =>
    dispatch(mentionsHandlers.epics.removeMention(nickname))

  return { removeMention }
}
const ChannelContentContainer = () => {
  const { mentions, channelId } = useChannelContentData()
  const { removeMention } = useChannelContentActions()

  return (
    <ChannelContent
      mentions={mentions as any}
      contactId={channelId}
      removeMention={removeMention}
      contentRect={''}
    />
  )
}

export default ChannelContentContainer