
import { createAction } from '@reduxjs/toolkit'

import { ActionsType, Socket } from '../const/actionsTypes'
import { DisplayableMessage } from '../../zbay/messages.types'

export type PublicChannelsActions = ActionsType<typeof publicChannelsActions>
export interface BasicMessage {
  channelId: string
  type: number
  signature: string
  r: number
  createdAt: number
  message: string
  id: string
  typeIndicator: number
}
export interface Libp2pMessage {
  channelAddress: string
  message: BasicMessage
}

interface ChannelInfo {
  address: string
  name: string
  description: string
  owner: string
  timestamp: number
  keys: Record<'ivk', string>
}

export interface IChannelInfoResponse {
  [name: string]: ChannelInfo
}

export const publicChannelsActions = {
  sendMessage: createAction(Socket.SEND_MESSAGE),
  loadMessage: createAction<Libp2pMessage>(Socket.MESSAGE),
  loadAllMessages: createAction<string>(Socket.FETCH_ALL_MESSAGES),
  responseLoadAllMessages: createAction<{
    channelAddress: string
    messages: any[]
  }>(Socket.RESPONSE_FETCH_ALL_MESSAGES),
  subscribeForTopic: createAction<string>(Socket.SUBSCRIBE_FOR_TOPIC),
  getPublicChannels: createAction<string>(Socket.GET_PUBLIC_CHANNELS),
  responseGetPublicChannels: createAction<IChannelInfoResponse>(Socket.RESPONSE_GET_PUBLIC_CHANNELS),
  addMessage: createAction<{
    key: string
    message: { [key: string]: DisplayableMessage }
  }>('ADD_MESSAGE'),
  setMessages: createAction<{
    messages: DisplayableMessage[]
    contactAddress: string
    username: string
    key: string
  }>('SET_DIRECT_MESSAGES')
}
