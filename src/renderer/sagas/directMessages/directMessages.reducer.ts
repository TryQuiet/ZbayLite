import { SignalWifi3BarLockTwoTone } from '@material-ui/icons'
import { createAction } from '@reduxjs/toolkit'

import { ActionsType, Socket } from '../const/actionsTypes'

export type DirectMessagesActions = ActionsType<typeof directMessagesActions>

export const directMessagesActions = {
  getAvailableUsers: createAction<string>(Socket.GET_AVAILABLE_USERS),
  addUser: createAction<{ address: string; halfKey: string, nickname: string }>(Socket.ADD_USER),
  responseGetAvailableUsers: createAction<string>(Socket.RESPONSE_GET_AVAILABLE_USERS),
  initializeConversation: createAction<{address: string, encryptedPhrase: string}>(Socket.INITIALIZE_CONVERSATION),
  sendMessage: createAction<string>(Socket.SEND_DIRECT_MESSAGE),
  getPrivateConversations: createAction(Socket.GET_PRIVATE_CONVERSATIONS),
  responseGetPrivateConversations: createAction<any>(Socket.RESPONSE_GET_PRIVATE_CONVERSATIONS)
}
