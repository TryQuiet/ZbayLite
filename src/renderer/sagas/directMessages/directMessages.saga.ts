import { all as effectsAll, takeEvery } from 'redux-saga/effects'
import { put, select } from 'typed-redux-saga'
import { directMessagesActions, DirectMessagesActions } from './directMessages.reducer'
import {
  getPublicKeysFromSignature,
  usernameSchema,
  exchangeParticipant
} from '../../zbay/messages'
import usersSelectors from '../../store/selectors/users'
import contactsSelectors from '../../store/selectors/contacts'
import { findNewMessages } from '../../store/handlers/messages'
import { DisplayableMessage } from '../../zbay/messages.types'
import { displayDirectMessageNotification, displayMessageNotification } from '../../notifications'
import BigNumber from 'bignumber.js'

import { actions, epics } from '../../store/handlers/directMessages'
import {actions as contactsActions} from '../../store/handlers/contacts'

const all: any = effectsAll

export function* addUser(action: DirectMessagesActions['addUser']): Generator {
  if (action.payload) {
    console.log(action.payload)
  }
  console.log('add user in saga')
  console.log('adding user')
}

export const transferToMessage = (msg, users) => {
  let publicKey = null
  let sender = { replyTo: '', username: 'Unnamed' }
  let isUnregistered = false
  const { r, message, signature, id, type, createdAt } = msg
  const signatureBuffer = Buffer.from(signature, 'base64')
  publicKey = getPublicKeysFromSignature({
    message,
    signature: signatureBuffer,
    r
  }).toString('hex')
  if (users !== undefined) {
    const fromUser = users[publicKey]
    if (fromUser !== undefined) {
      const isUsernameValid = usernameSchema.isValidSync(fromUser)
      sender = {
        ...exchangeParticipant,
        replyTo: fromUser.address,
        username: isUsernameValid ? fromUser.nickname : `anon${publicKey.substring(0, 10)}`
      }
    } else {
      sender = {
        ...exchangeParticipant,
        replyTo: '',
        username: `anon${publicKey}`
      }
      isUnregistered = true
    }
  }
  const parsedMessage: any = {
    id: id,
    message,
    r,
    type,
    createdAt,
    spent: new BigNumber(0),
    sender: sender,
    isUnregistered,
    publicKey,
    blockHeight: null
  }
  const displayableMessage = new DisplayableMessage(parsedMessage)
  return displayableMessage
}

export function* loadDirectMessage(action: DirectMessagesActions['loadDirectMessage']): Generator {
  const users = yield* select(usersSelectors.users)
  const myUser = yield* select(usersSelectors.myUser)
  const message = transferToMessage(action.payload.message, users)
  if (myUser.nickname !== message.sender.username) {
    displayDirectMessageNotification({
      username: message.sender.username,
      message: message
    })
    yield put(
      contactsActions.appendNewMessages({
        contactAddress: action.payload.channelAddress,
        messagesIds: [message.id]
      })
    )
  }
  yield put(
    directMessagesActions.addDirectMessage({
      key: action.payload.channelAddress,
      message: { [message.id]: message }
    })
  )
}

export function* loadAllDirectMessages(
  action: DirectMessagesActions['responseLoadAllDirectMessages']
): Generator {
  const users = yield* select(usersSelectors.users)
  const myUser = yield* select(usersSelectors.myUser)
  const channel = yield* select(contactsSelectors.contact(action.payload.channelAddress))
  if (!channel) {
    console.log(`Couldn't load all messages. No channel ${action.payload.channelAddress} in contacts`)
    return
  }

  const { username } = channel
  if (username) {
    const displayableMessages = action.payload.messages.map(msg => transferToMessage(msg, users))
    for (const msg of displayableMessages) {
      yield put(
        directMessagesActions.addDirectMessage({
          key: action.payload.channelAddress,
          message: { [msg.id]: msg }
        })
      )
    }
    const state = yield* select()
    const newMsgs = findNewMessages(action.payload.channelAddress, displayableMessages, state)
    newMsgs.forEach(msg => {
      if (msg.sender.username !== myUser.nickname) {
        displayMessageNotification({
          senderName: msg.sender.username,
          message: msg.message,
          channelName: username
        })
      }
    })
    yield put(
      contactsActions.appendNewMessages({
        contactAddress: action.payload.channelAddress,
        messagesIds: newMsgs
      })
    )
  }
}

export function* responseGetAvailableUsers(
  action: DirectMessagesActions['responseGetAvailableUsers']
): Generator {
  for (const [key, value] of Object.entries(action.payload)) {
    const user = yield* select(usersSelectors.registeredUser(key))

    yield put(
      actions.fetchUsers({
        usersList: {
          [key]: {
            publicKey: key,
            halfKey: value.halfKey,
            nickname: user?.nickname || `anon${key.substring(0, 8)}`
          }
        }
      })
    )
  }
}

export function* sendDirectMessage(action: DirectMessagesActions['sendDirectMessage']): Generator {
  console.log('sending direct message')
}

export function* initializeConversation(
  action: DirectMessagesActions['initializeConversation']
): Generator {
  console.log('initialize Conversation in saga')
}

export function* responseGetPrivateConversations(
  action: DirectMessagesActions['responseGetPrivateConversations']
): Generator {

  for (const [key, value] of Object.entries(action.payload)) {

    //epics.checkConversation(key, value)

    console.log(`${key}`)
    yield put(
      actions.fetchConversations({
        conversationsList: {
          [key]: value
        }
      })
    )
  }
}

export function* getPrivateConversations(
  action: DirectMessagesActions['getPrivateConversations']
): Generator {}

export function* directMessagesSaga(): Generator {
  yield all([
    //takeEvery(`${directMessagesActions.getAvailableUsers}`, getAvailableUsers),
    takeEvery(`${directMessagesActions.addUser}`, addUser),
    takeEvery(`${directMessagesActions.responseGetAvailableUsers}`, responseGetAvailableUsers),
    takeEvery(`${directMessagesActions.sendDirectMessage}`, sendDirectMessage),
    takeEvery(`${directMessagesActions.initializeConversation}`, initializeConversation),
    takeEvery(
      `${directMessagesActions.responseGetPrivateConversations}`,
      responseGetPrivateConversations
    ),
    takeEvery(`${directMessagesActions.getPrivateConversations}`, getPrivateConversations)
  ])
}