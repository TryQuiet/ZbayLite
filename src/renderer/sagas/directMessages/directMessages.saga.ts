import { all as effectsAll, takeEvery } from 'redux-saga/effects'
import { put, select } from 'typed-redux-saga'
import { directMessagesActions, DirectMessagesActions } from './directMessages.reducer'
import {
  getPublicKeysFromSignature,
  usernameSchema,
  exchangeParticipant
} from '../../zbay/messages'
import directMessagesSelectors from '../../store/selectors/directMessages'
import usersSelectors from '../../store/selectors/users'
import contactsSelectors from '../../store/selectors/contacts'
import channelSelectors from '../../store/selectors/channel'
import { findNewMessages } from '../../store/handlers/messages'
import contactsHandlers, { actions as contactsActions } from '../../store/handlers/contacts'
import { DisplayableMessage } from '../../zbay/messages.types'
import { displayDirectMessageNotification } from '../../notifications'
import BigNumber from 'bignumber.js'
import crypto from 'crypto'
import { actions, epics } from '../../store/handlers/directMessages'

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

const decodeMessage = (sharedSecret, message) => {
  const IVO = '5183666c72eec9e45183666c72eec9e4'
  const ENC_KEY = Buffer.from(sharedSecret.substring(0, 64), 'hex')
  const IV = Buffer.from(IVO, 'hex')

  const decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV)
  const stringifiedMessage = JSON.stringify(message)
  const decrypted = decipher.update(stringifiedMessage, 'base64', 'utf8')
  return decrypted + decipher.final('utf8')
}

export function* loadDirectMessage(action: DirectMessagesActions['loadDirectMessage']): Generator {
  const conversations = yield* select(directMessagesSelectors.conversations)
  const conversation = Array.from(Object.values(conversations)).filter(conv => {
    return conv.conversationId === action.payload.channelAddress
  })

  const contact = conversation[0]
  const contactPublicKey = contact.contactPublicKey
  const users = yield* select(usersSelectors.users)
  const myUser = yield* select(usersSelectors.myUser)
  const { id } = yield* select(channelSelectors.channel)
  const sharedSecret = conversations[id].sharedSecret
  const decodedMessage = decodeMessage(sharedSecret, action.payload.message)
  const message = transferToMessage(JSON.parse(decodedMessage), users)
  if (myUser.nickname !== message.sender.username) {
    displayDirectMessageNotification({
      username: message.sender.username,
      message: message
    })
    yield put(
      contactsActions.appendNewMessages({
        contactAddress: contactPublicKey,
        messagesIds: [message.id]
      })
    )
  }
  yield put(
    directMessagesActions.addDirectMessage({
      key: contactPublicKey,
      message: { [message.id]: message }
    })
  )
}

export function* loadAllDirectMessages(
  action: DirectMessagesActions['responseLoadAllDirectMessages']
): Generator {
  const conversations = yield* select(directMessagesSelectors.conversations)
  const conversation = Array.from(Object.values(conversations)).filter(conv => {
    return conv.conversationId === action.payload.channelAddress
  })
  const contact = conversation[0]

  const contactPublicKey = contact.contactPublicKey
  const sharedSecret = contact.sharedSecret
  const users = yield* select(usersSelectors.users)
  const myUser = yield* select(usersSelectors.myUser)
  const channel = yield* select(contactsSelectors.contact(contactPublicKey))
  if (!channel) {
    console.log(`Couldn't load all messages. No channel ${action.payload.channelAddress} in contacts`)
    return
  }

  const { username } = channel
  if (username) {
    const decodedMessages = action.payload.messages.map(msg => {
      console.log(msg)
      return JSON.parse(decodeMessage(sharedSecret, msg))
    })
    const displayableMessages = decodedMessages.map(msg => transferToMessage(msg, users))
    yield put(
      contactsHandlers.actions.setAllMessages({
        key: contactPublicKey,
        username: username,
        contactAddress: contactPublicKey,
        messages: displayableMessages
      })
    )

    const state = yield* select()
    const newMsgs = findNewMessages(contactPublicKey, displayableMessages, state)
    newMsgs.forEach(msg => {
      if (msg.sender.username !== myUser.nickname) {
        displayDirectMessageNotification({
          username: msg.sender.username,
          message: msg
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
  let decodedMessage = null
  try {
    decodedMessage = epics.decodeMessage(sharedSecret, encryptedPhrase)
  } catch (err) {
    console.log(err)
  }
  if (decodedMessage?.startsWith('no panic')) {
    console.log('success, message decoded successfully')

    return {
      sharedSecret,
      contactPublicKey: decodedMessage.slice(8),
      conversationId: id
    }
  } else {
    console.log('cannot decode message, its not for me or I am the author')
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
          username: user?.nickname || `anon${conversation.contactPublicKey.substring(0, 8)}`,
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
    takeEvery(`${directMessagesActions.responseLoadAllDirectMessages}`, loadAllDirectMessages),
    takeEvery(`${directMessagesActions.responseLoadDirectMessage}`, loadDirectMessage)
  ])
}
