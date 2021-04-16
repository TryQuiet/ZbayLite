import { SignalWifi3BarLockTwoTone } from '@material-ui/icons'
import { createAction } from '@reduxjs/toolkit'

import { ActionsType, Socket } from '../const/actionsTypes'
import { DisplayableMessage } from '../../zbay/messages.types'
export type DirectMessagesActions = ActionsType<typeof directMessagesActions>

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

export const directMessagesActions = {
  // Available users
  getAvailableUsers: createAction<string>(Socket.GET_AVAILABLE_USERS),
  addUser: createAction<{ publicKey: string; halfKey: string }>(Socket.ADD_USER),
  responseGetAvailableUsers: createAction<{[key: string]: { halfKey: string}}>(Socket.RESPONSE_GET_AVAILABLE_USERS),
  // Messages
  sendDirectMessage: createAction<string>(Socket.SEND_DIRECT_MESSAGE),
  loadDirectMessage: createAction<Libp2pMessage>(Socket.DIRECT_MESSAGE),
  loadAllDirectMessages: createAction(Socket.LOAD_ALL_DIRECT_MESSAGES),
  responseLoadAllDirectMessages: createAction<{
    channelAddress: string
    messages: any[]
  }>(Socket.RESPONSE_FETCH_ALL_DIRECT_MESSAGES),
  addDirectMessage: createAction<{
    key: string
    message: { [key: string]: DisplayableMessage }
  }>('ADD_MESSAGE'),
  // Private conversatinos
  initializeConversation: createAction<{address: string, encryptedPhrase: string}>(Socket.INITIALIZE_CONVERSATION),
  getPrivateConversations: createAction(Socket.GET_PRIVATE_CONVERSATIONS),
  responseGetPrivateConversations: createAction<{[key: string]: string}>(Socket.RESPONSE_GET_PRIVATE_CONVERSATIONS),
  subscribeForDirectMessageThread: createAction<string>(Socket.SUBSCRIBE_FOR_DIRECT_MESSAGE_THREAD),
  addMessage: createAction<{
    key: string
    message: { [key: string]: DisplayableMessage }
  }>('ADD_MESSAGE'),
}
