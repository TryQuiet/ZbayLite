import { all as effectsAll, takeEvery } from 'redux-saga/effects'
import { put, select } from 'typed-redux-saga'
import { directMessagesActions, DirectMessagesActions } from './directMessages.reducer'
import {
  getPublicKeysFromSignature,
  usernameSchema,
  exchangeParticipant
} from '../../zbay/messages'
import directMessagesSelectors  from '../../store/selectors/directMessages'
import usersSelectors from '../../store/selectors/users'
import contactsSelectors from '../../store/selectors/contacts'
import { findNewMessages } from '../../store/handlers/messages'
import { DisplayableMessage } from '../../zbay/messages.types'
import { displayDirectMessageNotification, displayMessageNotification } from '../../notifications'
import BigNumber from 'bignumber.js'
import crypto from 'crypto'
import { actions, epics } from '../../store/handlers/directMessages'
import {actions as contactsActions} from '../../store/handlers/contacts'

const all: any = effectsAll

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
  console.log('RECEIVED MESSAGE I SENT')
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
  console.log('loading direct messages')
  // Find out what contact should have message added
  // check if exist
  // also add logic to not add message if write to db was unsuccessfull

  console.log(`action payload chanel addresss is ${action.payload.channelAddress}`)
  const conversations = yield* select(directMessagesSelectors.conversations)
  console.log(`conversations are ${conversations}`)
  const conversation = Array.from(Object.values(conversations)).filter(conv => {
    console.log(`conv.conversationId ${conv.conversationId}`)

    return conv.conversationId == action.payload.channelAddress
  })
  console.log(`conversation is ${conversation}`)

  const contact = conversation[0]

console.log(`contact is ${contact}`)

  const contactPublicKey = contact.contactPublicKey

  console.log(`contact publickey is ${contactPublicKey}`)

  const users = yield* select(usersSelectors.users)
  const myUser = yield* select(usersSelectors.myUser)
  const channel = yield* select(contactsSelectors.contact(contactPublicKey))
  if (!channel) {
    console.log(`Couldn't load all messages. No channel ${action.payload.channelAddress} in contacts`)
    return
  }

  const { username } = channel
  if (username) {
    console.log(`action messages are ${action.payload.messages}`)
    const displayableMessages = action.payload.messages.map(msg => transferToMessage(msg, users))
    for (const msg of displayableMessages) {
      console.log(`msg is ${msg}`)
      yield put(
        directMessagesActions.addDirectMessage({
          key: contactPublicKey,
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
        contactAddress: contactPublicKey,
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

const checkConversation = (id, encryptedPhrase, privKey) => {
  const prime = 'b25dbea8c5f6c0feff269f88924a932639f8d8f937d19fa5874188258a63a373'
  const generator = '02'
  const dh = crypto.createDiffieHellman(prime, 'hex', generator, 'hex')
  dh.setPrivateKey(privKey, 'hex')
  const sharedSecret = dh.computeSecret(id, 'hex').toString('hex')
  let decodedMessage =  null
  try {
    decodedMessage = epics.decodeMessage(sharedSecret, encryptedPhrase)
  } catch (err) {
    console.log(err)
  }
  if (decodedMessage && decodedMessage.startsWith('no panic')) {
    console.log('success, message decoded successfully')
   
return {
  sharedSecret,
  contactPublicKey: decodedMessage.slice(8),
  conversationId: id
}

  } else {
    console.log('cannot decode message, its not for me')
    return null
  }
}

export function* responseGetPrivateConversations(
  action: DirectMessagesActions['responseGetPrivateConversations']
): Generator {

  const privKey = yield* select(directMessagesSelectors.privateKey)

  for (const [key, value] of Object.entries(action.payload)) {
    
    const conversation = checkConversation(key, value, privKey)
    
    if (conversation) {
      const user = yield* select(usersSelectors.registeredUser(key))
      yield put(
        directMessagesActions.subscribeForDirectMessageThread(conversation.conversationId)
      )
      yield put(
        actions.addConversation(conversation)
        )
      yield put(
        contactsActions.addContact({
          key: conversation.contactPublicKey,
          username: user?.nickname || `anon${conversation.contactPublicKey.substring(0,8)}`,
          contactAddress: user?.address || ''
        })
      )
    }

    yield put(
      actions.fetchConversations({
        conversationsList: {
          [key]: value
        }
      })
    )
  }
}

export function* directMessagesSaga(): Generator {
  yield all([
    takeEvery(`${directMessagesActions.responseGetAvailableUsers}`, responseGetAvailableUsers),
    takeEvery(
      `${directMessagesActions.responseGetPrivateConversations}`,
      responseGetPrivateConversations
    ),
    takeEvery(`${directMessagesActions.responseLoadAllDirectMessages}`, loadAllDirectMessages)
  ])
}
