import { io } from 'socket.io-client'
import crypto from 'crypto'
import * as R from 'ramda'
import {
  PublicChannelsActions,
  publicChannelsActions
} from '../publicChannels/publicChannels.reducer'
import {
  directMessagesActions,
  DirectMessagesActions
} from '../directMessages/directMessages.reducer'
import { eventChannel } from 'redux-saga'
import { transferToMessage } from '../publicChannels/publicChannels.saga'
import { fork, all, actionChannel } from 'redux-saga/effects'
import { call, take, select, put } from 'typed-redux-saga'
import { ActionFromMapping, Socket as socketsActions } from '../const/actionsTypes'
import channelSelectors from '../../store/selectors/channel'
import identitySelectors from '../../store/selectors/identity'
import directMessagesSelectors from '../../store/selectors/directMessages'
import usersSelectors from '../../store/selectors/users'
import { messages } from '../../zbay'
import config from '../../config'
import { messageType } from '../../../shared/static'
import { ipcRenderer } from 'electron'

import identityHandlers from '../../store/handlers/identity'
import waggleHandlers from '../../store/handlers/waggle'

export const connect = async () => {
  const socket = io(config.socket.address)
  console.log(socket)
  return await new Promise(resolve => {
    socket.on('connect', async () => {
      ipcRenderer.send('connectionReady')
      resolve(socket)
    })
  })
}

export function subscribe(socket) {
  return eventChannel<ActionFromMapping<PublicChannelsActions & DirectMessagesActions>>(emit => {
    socket.on(socketsActions.MESSAGE, payload => {
      emit(publicChannelsActions.loadMessage(payload))
    })
    socket.on(socketsActions.RESPONSE_FETCH_ALL_MESSAGES, payload => {
      emit(publicChannelsActions.responseLoadAllMessages(payload))
    })
    socket.on(socketsActions.RESPONSE_GET_PUBLIC_CHANNELS, payload => {
      emit(publicChannelsActions.responseGetPublicChannels(payload))
    })
    // Direct messages
    socket.on(socketsActions.DIRECT_MESSAGE, payload => {
      console.log('respnse direct message')
      emit(directMessagesActions.responseLoadDirectMessage(payload))
    })
    socket.on(socketsActions.RESPONSE_FETCH_ALL_DIRECT_MESSAGES, payload => {
      emit(directMessagesActions.responseLoadAllDirectMessages(payload))
    })
    socket.on(socketsActions.RESPONSE_GET_AVAILABLE_USERS, payload => {
      emit(directMessagesActions.responseGetAvailableUsers(payload))
    })
    socket.on(socketsActions.RESPONSE_GET_PRIVATE_CONVERSATIONS, payload => {
      emit(directMessagesActions.responseGetPrivateConversations(payload))
    })
    return () => {}
  })
}

export function* handleActions(socket): Generator {
  const socketChannel = yield* call(subscribe, socket)
  while (true) {
    const action = yield* take(socketChannel)
    yield put(action)
  }
}

export function* sendMessage(socket): Generator {
  while (true) {
    yield* take(`${publicChannelsActions.sendMessage}`)
    const { address } = yield* select(channelSelectors.channel)
    const messageToSend = yield* select(channelSelectors.message)
    const users = yield* select(usersSelectors.users)
    let message = null
    const privKey = yield* select(identitySelectors.signerPrivKey)
    message = messages.createMessage({
      messageData: {
        type: messageType.BASIC,
        data: messageToSend
      },
      privKey: privKey
    })
    const messageDigest = crypto.createHash('sha256')
    const messageEssentials = R.pick(['createdAt', 'message'])(message)
    const key = messageDigest.update(JSON.stringify(messageEssentials)).digest('hex')
    const preparedMessage = {
      ...message,
      id: key,
      typeIndicator: false,
      signature: message.signature.toString('base64')
    }
    const displayableMessage = transferToMessage(preparedMessage, users)
    yield put(
      publicChannelsActions.addMessage({
        key: address,
        message: { [preparedMessage.id]: displayableMessage }
      })
    )
    socket.emit(socketsActions.SEND_MESSAGE, { channelAddress: address, message: preparedMessage })
  }
}

export function* subscribeForTopic(socket): Generator {
  while (true) {
    const { payload } = yield* take(`${publicChannelsActions.subscribeForTopic}`)
    socket.emit(socketsActions.SUBSCRIBE_FOR_TOPIC, payload)
  }
}

export function* fetchAllMessages(socket): Generator {
  while (true) {
    const { payload } = yield* take(`${publicChannelsActions.loadAllMessages}`)
    socket.emit(socketsActions.FETCH_ALL_MESSAGES, payload)
  }
}

export function* getPublicChannels(socket): Generator {
  while (true) {
    yield* take(`${publicChannelsActions.getPublicChannels}`)
    socket.emit(socketsActions.GET_PUBLIC_CHANNELS)
  }
}

// Direct Messages

export function* subscribeForDirectMessageThread(socket): Generator {
  while (true) {
    const { payload } = yield* take(`${directMessagesActions.subscribeForDirectMessageThread}`)
    socket.emit(socketsActions.SUBSCRIBE_FOR_DIRECT_MESSAGE_THREAD, payload)
  }
}

export function* getAvailableUsers(socket): Generator {
  while (true) {
    yield* take(`${directMessagesActions.getAvailableUsers}`)
    socket.emit(socketsActions.GET_AVAILABLE_USERS)
  }
}

export function* initializeConversation(socket): Generator {
  while (true) {
    const { payload } = yield* take(`${directMessagesActions.initializeConversation}`)
    socket.emit(socketsActions.INITIALIZE_CONVERSATION, payload)
  }
}

export function* getPrivateConversations(socket): Generator {
  while (true) {
    yield* take(`${directMessagesActions.getPrivateConversations}`)
    socket.emit(socketsActions.GET_PRIVATE_CONVERSATIONS)
  }
}

const encodeMessage = (sharedSecret, message) => {
  const IVO = '5183666c72eec9e45183666c72eec9e4'
  const ENC_KEY = Buffer.from(sharedSecret.substring(0, 64), 'hex')
  const IV = Buffer.from(IVO, 'hex')

  const cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV)
  const stringifiedMessage = JSON.stringify(message)
  let encrypted = cipher.update(stringifiedMessage, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return encrypted
}

export function* sendDirectMessage(socket): Generator {
  while (true) {
    yield* take(`${directMessagesActions.sendDirectMessage}`)
    console.log('entered sending DM')
    const { id } = yield* select(channelSelectors.channel)
    const conversations = yield* select(directMessagesSelectors.conversations)
    const conversationId = conversations[id].conversationId
    const sharedSecret = conversations[id].sharedSecret
    console.log('1')
    const messageToSend = yield* select(channelSelectors.message)
    const users = yield* select(usersSelectors.users)
    let message = null
    const privKey = yield* select(identitySelectors.signerPrivKey)
    message = messages.createMessage({
      messageData: {
        type: messageType.BASIC,
        data: messageToSend
      },
      privKey: privKey
    })
    console.log('2')
    const messageDigest = crypto.createHash('sha256')
    const messageEssentials = R.pick(['createdAt', 'message'])(message)
    const key = messageDigest.update(JSON.stringify(messageEssentials)).digest('hex')
    const preparedMessage = {
      ...message,
      id: key,
      typeIndicator: false,
      signature: message.signature.toString('base64')
    }
    console.log('3')
    // const displayableMessage = transferToMessage(preparedMessage, users)
    // yield put(
    //   directMessagesActions.addMessage({
    //     key: id,
    //     message: { [preparedMessage.id]: displayableMessage }
    //   })
    // )
    const encryptedMessage = encodeMessage(sharedSecret, preparedMessage)
    console.log(`encrypted ${encryptedMessage}`)
    socket.emit(socketsActions.SEND_DIRECT_MESSAGE, {
      channelAddress: conversationId,
      message: encryptedMessage
    })
  }
}

export function* loadInitialState(socket): Generator {
  while (true) {
    console.log('INSIDE LOAD INITIAL STATE ADD USERs')
    // yield all([take('SET_PUBLIC_KEY')])
    yield take('SET_IS_WAGGLE_CONNECTED')

    let wagglePublicKey = yield select(directMessagesSelectors.publicKey)
    let signerPublicKey = yield select(identitySelectors.signerPubKey)

    if (wagglePublicKey && signerPublicKey) {
      socket.emit(socketsActions.ADD_USER, { publicKey: signerPublicKey, halfKey: wagglePublicKey })
    }

    yield take('SET_PUBLIC_KEY')

    wagglePublicKey = yield select(directMessagesSelectors.publicKey)
    signerPublicKey = yield select(identitySelectors.signerPubKey)

    if (wagglePublicKey && signerPublicKey) {
      socket.emit(socketsActions.ADD_USER, { publicKey: signerPublicKey, halfKey: wagglePublicKey })
    }

    // console.log('took all things')

    // const wagglePublicKey = yield select(directMessagesSelectors.publicKey)
    // const signerPublicKey = yield select(identitySelectors.signerPubKey)

    // console.log('BEFORE EMITTING NEW USER TO WAGGLE ')

    // socket.emit(socketsActions.ADD_USER, { publicKey: signerPublicKey, halfKey: wagglePublicKey })
  }
}

export function* useIO(socket): Generator {
  yield fork(handleActions, socket)
  yield fork(sendMessage, socket)
  yield fork(fetchAllMessages, socket)
  yield fork(subscribeForTopic, socket)
  yield fork(getPublicChannels, socket)
  // Direct Messages
  yield fork(getAvailableUsers, socket)
  yield fork(initializeConversation, socket)
  yield fork(sendDirectMessage, socket)
  yield fork(getPrivateConversations, socket)
  yield fork(loadInitialState, socket)
  yield fork(subscribeForDirectMessageThread, socket)
}

export function* startConnection(): Generator {
  while (true) {
    yield take(socketsActions.CONNECT_TO_WEBSOCKET_SERVER)
    console.log('before initializing forrk useIO')
    const socket = yield call(connect)
    yield fork(useIO, socket)
  }
}
